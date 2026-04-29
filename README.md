# SPOTIFY&SHARE | Music & Social Platform 
**Live Demo:** https://music-social-platform.netlify.app/    <br><br>
SPOTIFY&SHARE is a full-stack social platform designed for music discovery and artist collaboration. <br>
It bridges the gap between listeners and creators, offering a managed ecosystem for high-quality content sharing.

The "SHARE" Concept Unlike standard music platforms,<br>
the SHARE aspect introduces a collaborative network for artists.<br>
Every piece of content is curated and managed through a strict approval workflow,<br>
ensuring a professional environment for both creators and fans.<br>


### Tech Stack
* Frontend: **React.js**
  
* Backend: **Node.js, Express**
  
* Database: **MySQL (Optimized Schema)**
  
* Security: **JWT-based Auth, Bcrypt Encryption**


### Role-Based Access Control (RBAC) 
The system features a robust permission model with three distinct levels:
1. **Administrator (Top Tier)**
* Full System Control: Manages permissions for all users.
* Content Curation: Exclusive authority to review and approve/reject song upload requests from artists. 
* Gatekeeping: No content goes live without Admin approval.

2.**Artists**
* Content Creation: Ability to upload songs and professional content. 
* Status Workflow: Uploads are sent as "requests" and remain pending until approved by the Admin.

3.**Regular Users (Standard Tier)** 
 *Consumption: Listen to music and engage with the platform.
* Personalization: Dedicated "Personal Area" for creating and managing private playlists.
* Interaction: Ability to view and post comments on tracks.
* Growth: Option to request a promotion to "Artist" status from the Administrator.


### Installation & Setup
Follow these steps to run the project locally:

1. **Clone the repository** Copy and run this command in your terminal:  
   `git clone https://github.com/Ayala-Barsheshet/Final-project.git`

2. **Frontend Setup** Open a terminal, navigate to the client folder, and start the development server:  
   `cd client && npm install && npm run dev`

3. **Backend Setup** Open a **separate** terminal, navigate to the server folder, and start the backend:  
   `cd server && npm install && node app.js`

4. **Environment Configuration** Ensure your database and environment variables are configured before running the servers.


### Architecture & Security 

* Layered Architecture: Clear separation of concerns using Controllers, Services, and a DB Layer.

* Secure Auth: JWT session management ensuring private client-server communication.

* Database Design: Optimized MySQL relational structure for efficient playlist and user management.


### Disclaimer
This project was developed for educational and portfolio purposes only.<br>
It is inspired by Spotify but is not affiliated with, associated with, or endorsed by Spotify AB.<br>
All trademarks and brand names belong to their respective owners.

*Created by Ayala Barsheshet*

