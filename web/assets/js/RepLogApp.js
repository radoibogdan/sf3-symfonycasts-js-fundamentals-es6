'use strict';

(function(window, $, Routing, swal) {
    // Make Helper private, each ReplogApp instance will have its own private Helper instance
    let HelperInstances = new Map();

    class RepLogApp {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.repLogs = [];

            // this = key, 'this' will reference this RepLogApp instance so we can have multiple RepLogApp(each with its own Helper instance).
            HelperInstances.set(this, new Helper(this.repLogs));

            this.loadRepLogs();

            this.$wrapper.on(
                'click',
                '.js-delete-rep-log',
                this.handleRepLogDelete.bind(this)
            );
            this.$wrapper.on(
                'click',
                'tbody tr',
                this.handleRowClick.bind(this)
            );
            this.$wrapper.on(
                'submit',
                RepLogApp._selectors.newRepForm,
                this.handleNewFormSubmit.bind(this)
            );
        }

        /* Classes can have properties using the set / get ES6 syntax OR you can also define them in the constructor */
        /* This property can be static because we are not using "this" inside it */
        static get _selectors() {
            return {
                newRepForm: '.js-new-rep-log-form'
            }
        }

        loadRepLogs() {
            $.ajax({
                url: Routing.generate('rep_log_list'),
            }).then((data) => {
                // The for of loop does not let you see the key from an associative array (for il loop does let you)
                for(let repLog of data.items) {
                    // "this" inside an arrow function refers to this object. using self variable is no longer needed
                    this._addRow(repLog);
                }
            });
        }

        updateTotalWeightLifted() {
            this.$wrapper.find('.js-total-weight').html(
                HelperInstances.get(this).getTotalWeightString()
            );
        }

        handleRepLogDelete (e) {
            e.preventDefault();

            // Use const where you don't need to reassign the variable later
            const $link = $(e.currentTarget);

            swal({
                title: 'Delete this log?',
                text: 'What? Did you not actually lift this?',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                // you can omit curly braces and "return" when you have a one liner
                preConfirm: () => this._deleteRepLog($link)
            }).catch((arg) => {
                // canceling is cool!
            });
        }

        _deleteRepLog($link) {
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');

            const deleteUrl = $link.data('url');
            const $row = $link.closest('tr');

            return $.ajax({
                url: deleteUrl,
                method: 'DELETE'
            }).then(() => {
                $row.fadeOut('normal', () => {
                    // remove repLog from this.repLogs, "key" is the index to this repLog on this.repLogs
                    this.repLogs.splice($row.data('key'), 1);
                    // remove from dom
                    $row.remove();
                    this.updateTotalWeightLifted();
                });
            })
        }

        handleRowClick () {
            console.log('row clicked!');
        }

        handleNewFormSubmit(e) {
            e.preventDefault();

            const $form = $(e.currentTarget);
            const formData = {};
            for(let fieldData of $form.serializeArray()) {
                formData[fieldData.name] = fieldData.value
            }
            this._saveRepLog(formData)
            .then((data) => {
                this._clearForm();
                this._addRow(data);
            }).catch((errorData) => {
                this._mapErrorsToForm(errorData.errors);
            });
        }

        _saveRepLog(data) {
            return new Promise((resolve, reject) => {
                const url = Routing.generate('rep_log_new');
                $.ajax({
                    url,  // url : url
                    method: 'POST',
                    data: JSON.stringify(data)
                }).then((data, textStatus, jqXHR) => {
                    $.ajax({
                        url: jqXHR.getResponseHeader('Location')
                    }).then((data) => {
                        // we're finally done!
                        resolve(data);
                    });
                }).catch((jqXHR) => {
                    const errorData = JSON.parse(jqXHR.responseText);

                    reject(errorData);
                });
            });
        }

        _mapErrorsToForm(errorData) {
            this._removeFormErrors();
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);

            // $(this) refers to the object now, we must replace with $(element)
            for(let element of $form.find(':input')) {
                const fieldName = $(element).attr('name');
                const $wrapper = $(element).closest('.form-group');
                if (!errorData[fieldName]) {
                    // no error!
                    continue;
                }

                const $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $wrapper.append($error);
                $wrapper.addClass('has-error');
            }
        }

        _removeFormErrors() {
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');
        }

        _clearForm() {
            this._removeFormErrors();

            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            $form[0].reset();
        }

        _addRow(repLog) {
            this.repLogs.push(repLog);
            /*DESTRUCTURING*/
            // let {id, itemLabel, reps, madeUpKey = 'defaultKey'} = repLog;
            // console.log(id, itemLabel, reps, madeUpKey);

            const html = rowTemplate(repLog);
            const $row = $($.parseHTML(html))
            // store the repLogs index
            $row.data('key', this.repLogs-1);

            let $title = $('<h2>cacat</h2>');
            this.$wrapper.find('tbody').append($title);
            let jsElement = document.createElement('h2');
            let jsText = document.createTextNode('cacat in js');
            jsElement.appendChild(jsText);
            this.$wrapper.find('tbody').append(jsElement);
            this.$wrapper.find('tbody').append($row);

            this.updateTotalWeightLifted();

        }
    }

    /**
     * A private object that we can only use from inside of this self executing function
     */
    class Helper {
        constructor (repLogs) {
            this.repLogs = repLogs;
        }

        calculateTotalWeight() {
            /* Using static method */
            return Helper._calculateWeight(this.repLogs);
        }
        // Default value !!!
        getTotalWeightString(maxWeight = 500) {
            let weight = this.calculateTotalWeight();
            if (weight > maxWeight) {
                weight = maxWeight + '+'
            }
            return weight + ' kg'
        }
        /* Create static method*/
        static _calculateWeight(repLogs) {
            let totalWeight = 0;
            for (let repLog of repLogs) {
                totalWeight += repLog.totalWeightLifted;
            }

            return totalWeight;
        }
    }

    // Template string - Used in tagged template
    function upper(template, ...expressions) {
        return template.reduce((accumulator, part, i) => {
            return accumulator + (expressions[i - 1].toUpperCase ? expressions[i - 1].toUpperCase() : expressions[i - 1]) + part
        })
    }

    // Template string
    const rowTemplate = (repLog) => `
        <tr data-weight="${repLog.totalWeightLifted}">
            <td>${repLog.itemLabel}</td>
            <td>${repLog.reps}</td>
            <td>${repLog.totalWeightLifted}</td>
            <td>
                <a href="#"
                   class="js-delete-rep-log"
                   data-url="${repLog.links._self}"
                >
                    <span class="fa fa-trash"></span>
                </a>
            </td>
        </tr>
    `;

    // Export the class to the global scope. Make the RepLog app Globally accessible
    window.RepLogApp = RepLogApp;

})(window, jQuery, Routing, swal);
