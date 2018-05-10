# README
# Betwixt
Betwixt is a web application that lets users read, like and publish stories, and follow other authors as well. Inspired by Medium.

[Live Link](http://things-betwixt.herokuapp.com/#/)

## Technologies Used

  ####**Backend**
     * Backend Framework: Ruby on Rails
     * Database: PostgreSQL
  ####**Frontend**
     * React/Redux
     * [React-Quill](https://github.com/zenoamaro/react-quill) Component for Rich Text Editor
     * Styling: HTML5/CSS3

![Homepage](https://github.com/gabrieltal/betwixt/blob/master/docs/wireframes/betwixt-main.gif)

## Features
 ### User Authentication
   * Users can create accounts, log in and out
   * User created stories are featured on their profile pages
   * User number of followers and following are also featured on their website

  ### Story creation
   * Users can create stories using React-Quill This allows the user to set headers, images as well as bullet points and list elements in the stories they create.
   * Users can edit their stories and the edit date will also be reflected on the site allowing users to know when the story was edited
   * Users can also upload their own header images as well as edit their own custom profile pictures. The photos are retrieved using AWS and uses [Paperclip](https://github.com/thoughtbot/paperclip) as a file attachment for the Rails backend.

 ### Follows
   * When users begin following users their main feed will first be populated with stories from users they follow
   * Users can follow other users from the main page or on their profile page or when reading one of their stories

 ### Likes
   * Users can like content and see stories other users have liked on the user show page

![Homepage](https://github.com/gabrieltal/betwixt/blob/master/docs/wireframes/tab-twixt.gif)

 ### User Show Page
   * Users are able to see what content they have liked and are able to click on the story liked and go into the story show page
   * Users are able to see content other users have commented on by going to that user show page and are able to click to see what story it was they commented on
   * Users are able to view stories other users have written on the specific user show page

  ### Code Highlights

   #### Utilizing custom routes on the backend

    In order to avoid making additional calls to the backend in order to do simple tasks such as unliking content or unfollowing someone; which usually using the rails boilerplate routes you would need to hold the id for the Like or Follow. I wanted to keep a clean state and not hold an id I wouldn't really need in most cases. My stories only need to hold the user ids for users who have liked it. My users only need the story id for the stories they like. To avoid carrying the Like id I created a custom route to send the story id and the user id and in the backend I found the like based off those two ids and accomplished the unliking in the backend.


    `@like = Like.find_by_user_id_and_story_id(params[:user_id], params[:story_id])
      if @like
        @like.destroy`

  `delete 'api/likes/:user_id/:story_id', :to => 'api/likes#destroy'`

  I did the same for unfollowing other users. I utilize custom routes and custom controller methods for a few other tasks in order to grab the necessary content and filter on the backend rather than client side.
 ### Additional Resources
   * [Wireframe Proposal](https://github.com/gabrieltal/betwixt/wiki/Component-Hierarchy-with-Wireframes)
   * [Database Schema](https://github.com/gabrieltal/betwixt/wiki/Database-Schema)
   * [Sample State](https://github.com/gabrieltal/betwixt/wiki/Sample-State)
   * [API Endpoints](https://github.com/gabrieltal/betwixt/wiki/Routes)

 ### Future
   * Implementation of Tagging to allow users to search for specific stories and to better organize stories on the front page
   * Implementation of editing, deleting and liking comments
   * Allow saving of drafts of stories so users can come back to finish their works at a later date
