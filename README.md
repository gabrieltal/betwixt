# README
# Betwixt
Betwixt is a web application that lets users read, like and publish stories, and follow other authors as well. Inspired by Medium it was built using Rails, React, Redux and Javascript.

[Live Link](http://things-betwixt.herokuapp.com/#/)

## Features
 ### User Authentication
   * Users can create accounts, log in and out
   * User created stories are featured on their profile pages
   * User number of followers and following are also featured on their website

  ### Story creation
   * Users can create stories using [React-Quill](https://github.com/zenoamaro/react-quill) This allows the user to set headers, images as well as bullet points and list elements in the stories they create.
   * Users can edit their stories and the edit date will also be reflected on the site allowing users to know when the story was edited
   * Users can also upload their own header images as well as edit their own custom profile pictures. The photos are retrieved using AWS and uses [Paperclip](https://github.com/thoughtbot/paperclip) as a file attachment for the Rails backend.
 ### Follows
   * When users begin following users their main feed will first be populated with stories from users they follow
   * Users can follow other users from the main page or on their profile page or when reading one of their stories
 ### Future
   * Implementation of Tagging to allow users to search for specific stories and to better organize stories on the front page
   * Implementation of editing, deleting and liking comments
   * Feature user's comments, likes and who they are following on their profile page at a click of a button
   * Allow saving of drafts of stories so users can come back to finish their works at a later date
