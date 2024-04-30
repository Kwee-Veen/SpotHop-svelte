<h1>SpotHop</h1>

![Readme_Image](https://github.com/Kwee-Veen/SpotHop/assets/118535981/ccf48c53-b5fc-4ff7-88d0-b55c095e4efa)

SpotHop is a placemark-focused application, allowing creation and management of user-generated 'Spots'. <br>
Users can sign up and log in, create and manage their own spots, and view those of other users. <br>
Spots can include a name and description, a category, and lat/long coordinates. <br>
Images can also be uploaded for spots, which are cloud-hosted (Cloudinary). 

Analytics are generated for all saved spots, including a breakdown by spot category and user vs. global spots. <br>
Searches can be performed to only display spots meeting specific criteria, including name, category, coordinates and user-generated. <br>
User accounts can be deleted; the first user to be created is also designated as the admin, and can view, modify and delete all user accounts.

<hr>

SpotHop is hosted by both Render:<br>
    _https://spothop.onrender.com/_ <br>
and Glitch:<br>
    _https://spothop.glitch.me/_ <br>


Spothop is also a REST API; users and spots can be created, found and deleted through HTTP requests.<br>
The API is supported by Swagger 2.0 documentation, with descriptions of all API functions and secure testing facilitated.<br>
Spothop is secured using cookie authentication (web app) and JSON Web Token JWT authentication (API).

<hr>

Test-driven development was employed in building SpotHop, and a full suite of tests for both the web app and API are provided.

SpotHop's default persistence route is MongoDB, cloud-hosted (Cloud Atlas), 
JSON persistence can be employed by tweaking the src/server.js file from:<br>  
  **db.init("mongo");** <br>
to:<br>
    **db.init();** <br>
    
<hr>

The following environmental variables must be specified in order to reproduce this web app: <br>
    _COOKIE_NAME (String)_ <br>
    _COOKIE_PASSWORD (String)_ <br>
    _db (String - Cloud Atlas MongoDB server connection string)_ <br>
    _cloudinary_name (String - Cloudinary credentials)_ <br>
    _cloudinary_key (String - Cloudinary credentials)_ <br>
    _cloudinary_secret (String - Cloudinary credentials)_ <br>
    
<hr>
