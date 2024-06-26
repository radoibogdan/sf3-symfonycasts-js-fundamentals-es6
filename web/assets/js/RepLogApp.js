'use strict';

(function(window, $, Routing, swal) {
    class RepLogApp {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.helper = new Helper(this.$wrapper);

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
                $.each(data.items, (key, repLog) => {
                    // "this" inside an arrow function refers to this object. using self variable is no longer needed
                    this._addRow(repLog);
                });
            })
        }

        updateTotalWeightLifted() {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.getTotalWeightString()
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
            $.each($form.serializeArray(), (key, fieldData) => {
                formData[fieldData.name] = fieldData.value
            });
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
            $form.find(':input').each((index, element) => {
                const fieldName = $(element).attr('name');
                const $wrapper = $(element).closest('.form-group');
                if (!errorData[fieldName]) {
                    // no error!
                    return;
                }

                const $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $wrapper.append($error);
                $wrapper.addClass('has-error');
            });
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
            const tplText = $('#js-rep-log-row-template').html();
            const tpl = _.template(tplText);

            const html = tpl(repLog);
            this.$wrapper.find('tbody').append($.parseHTML(html));

            this.updateTotalWeightLifted();
        }
    }

    class Helper {
        constructor ($wrapper) {
            this.$wrapper = $wrapper;
        }

        calculateTotalWeight() {
            /* Using static method */
            return Helper._calculateWeight(
                this.$wrapper.find('tbody tr')
            );
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
        static _calculateWeight($elements) {
            let totalWeight = 0;
            $elements.each((index, element) => {
                totalWeight += $(element).data('weight');
            });

            return totalWeight;
        }
    }

    // Export the class to the global scope. Make the RepLog app Globally accessible
    window.RepLogApp = RepLogApp;

})(window, jQuery, Routing, swal);
