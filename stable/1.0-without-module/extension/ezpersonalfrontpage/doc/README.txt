eZ Personal Frontpage extension 1.0 README

What is the eZ Personal Frontpage extension?
============================================

eZ Personal Frontpage allows content objects to be shown
on personalized frontpages which can individually be moved
by drag & drop via JavaScript.
It is possible to create widget boxes such as a calendar,
a list of news items, the article of the week for example.
A list of all available boxes is defined as object relation list.
Each user can choose items from this list
and place them as boxes on his personalized page in a set of a previously defined
number of columns.
The arrangement of the boxes is saved as user setting,
so if an user will visit his personal frontpage the next time he will come
upon his personal frontpage as he left it.


eZ Personal Frontpage version
=============================

The current version of  eZ Personal Frontpage is 1.0.0.
You can find details about changes for this version in
doc/changelogs/


License
=======

This software is licensed under the eZ Proprietary License. The complete
license agreement is included in the LICENSE file. For more information
or questions please contact info@ez.no

Requirements
============

The following requirements exists for using eZ Personal Frontpage extension:

o  eZ Publish version:

   Make sure you use eZ Publish version 3.9 or higher.

o  eZ Webin 1.2.0

    eZ Webin 1.2 or higher is required.

o  PHP version:

   as indicated in your eZ Publish version requirements

o  Web Browser:

   Make sure you have one of the following web browsers:
   Internet Explorer 6.0 or higher,
   Mozilla 1.3 or higher,
   Firefox 1.0 or higher.

o  Javascript support has to be enabled in your web browser


Installation
============

Please read the INSTALL file for installation instructions.


Creating a new personalized frontpage
=====================================

1. To set up a new personalized frontpage you have to create a new
   'Personalized Frontpage' content object somewhere in the content tree.
   The content class is installed when importing the eZ personal
   frontpage package.
   You will have to set up the following attributes:

a. 'Title' will be used as title. (For example inside the menu)

b. 'Available Widget List' is a list of content object which will be
   available as widgets on the personal frontpage.
   The way an content object is displayed is controlled by templates
   defined in the personalfrontpage.ini file located in:
   'extensions/ezpersonalfrontpage/settings/'.
   This file includes further information about template configuration.

c. 'Number of columns' defines the number of available columns wherein widgets
   can be placed.
   Using more than three columns requires tweaking the styleesheets located in:
   'extensions/ezpersonalfrontpage/design/ezpersonalfrontpage/stylesheets/'

d. 'Allow Minimization' enables or disables a minimization button for all
   widget boxes.

e. 'Default Arrangement' is an JSON string which defines the initial arrangement
   of the widget boxes in case of the initial user visit.
   The following example for a personalized frontpage with 3 columns
   will place the widgets with ObjectID 147 and 167 in the
   first column. The widgets with ObjectID 159, 102 and 96 will be placed in
   second column. Objects 99, 166 and 149 will be placed in third column.
   All other available widgets will not be shown, but are available for selection:

   [[147,167],[159,102,96],[99,166,149]]

   If you do not want to set up a default arrangement, you can leave
   this field blank.

2. In order to prevent anonymous users from using a personalized frontpage
   you should set the section of the content class to 'Restricted'.
   Therefor edit your personalized frontpage and choose 'Restricted' from 
   the dropdown menu located at the left toolbar and click to 'Set'.
   This will show the personalized frontpage only to users, that are logged in.



Using eZ Publish modules as widgets
===================================

eZ Personal Frontpage also supports the usage of modules as widget boxes.
Therefore the content class "Module Widget" is installed with eZ Personal
Frontpage. Instances of this class can be used as described above.
You will only have to specify the "Module URL" to a module placed in
an user-defined extension.

To include you module/view as widget you will have to set the
module URL to:

    mymodule/view

Please remember to adjust the according eZ Publish policies
concerning this module, so that users using eZ Personal Frontpage
have the required access rights.



Where to get more help
======================

eZ Publish forums: http://ez.no/community/forum


Troubleshooting
===============

1. Read the FAQ
   ------------

   Some problems are more common than others. The most common ones are listed
   in the FAQ file.

2. Support
   -------

   If you have find any problems not handled by this document or the FAQ you
   can contact eZ system trough the support system:
   http://ez.no/services/support
