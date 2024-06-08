Javascript for PHP Geeks Tutorial
=================================
 [Modern JavaScript Tutorials][1]

## Setup

### Setup parameters.yml
Check `app/config/parameters.yml` If you don't, copy `app/config/parameters.yml.dist` to get it.

### Install composer 2.2 else you will have errors
https://stackoverflow.com/questions/75258393/how-to-install-two-composer-in-one-windows-system
- Go to C:\ProgramData\ComposerSetup\bin
- Create folder composer2.2
- Copy files
    - from C:\ProgramData\ComposerSetup\bin
    - to   C:\ProgramData\ComposerSetup\bin\composer2.2
- Rename composer.bat to composer2.2.bat
- Set path composer2.2 to environment variable
- Run `composer1 self-update --2.2`
- Test with `composer2.2 -v`

### Download Composer dependencies
```
composer2.2 install
```

### Setup the Database
Check `app/config/parameters.yml`
```
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
```

If you get an error that the database exists, that should
be ok. But if you have problems, completely drop the
database (`doctrine:database:drop --force`) and try again.

### Start the built-in web server
```
php bin/console server:run
```
User : ron_furgandy  
Pass : pumpup

### Start
Install jquery  
Go to base.html.twig   
ALT + ENTER on links => Download  

## Links
[1]: http://knpuniversity.com/tracks/javascript#modern-javascript