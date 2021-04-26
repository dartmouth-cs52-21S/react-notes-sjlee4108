# Lab 3: React Notes

*Built a page using React and Firebase that supports a real-time note sharing.*

[deployed url](https://compassionate-fermi-1eecdd.netlify.app/)


## What Worked Well
* I was able to utilize Firebase to support the real-time editing for multiple users.
* I was able to use react components to build the webpage.

## What Didn't
* react-draggable took some time to understand and implement.
* For EC, authentication and routers were quite tricky to get it to work.
* For EC, I was not able to update editmode for users that went back to previous page. I tried using window.popstate listener. It worked, but it had some memory leak and decided to exclude it. 

## Extra Credit
1. **Authentication:** I used Firebase Auth with Google Authentication. So, for users to use our platform, they would need to log in using their google account. User will have access to the board once they log-in. 
2. **Multiple Boards:** Once a user log in, they have two options: create a new board or use existing one. To use a board created by other users, a user would need the key of a board, which is shown in the web url. (https://compassionate-fermi-1eecdd.netlify.app/**[copy this key]**). The textbox for key and title also shows an error message if a title is too long, a title/key is empty, and a key is invalid.
3. **Z-index:** I created a variable in Firebase that keeps track of the max z-index. Whenever user drags an item, it checks if the z-index of the dragged item has the highest z-index. If not, it updates the item to the (max z-index + 1) and updates max z-index in Firebase.
4. **User Editmode**: Whenever a user is editing or dragging a post, the user's google profile pic is shown at the bottom of the note. While the note is on edit mode, other users cannot drag, edit or delete the note. The only slight problem with this editmode is that the note stays on editmode if a user goes back to previous page, which can be solved by refreshing the page.  

## Screenshots

![auth screen](/screenshots/auth.png)

* landing page. Click google button to sign in

![after sign in](/screenshots/multiple.png)

* After signing in. Shows multiple boards and error message for invalid key.

![before](/screenshots/zbefore.png)
![after](/screenshots/zafter.png)

* First picture shows posts created in order. The second picture shows the result of dragging the first post. 

![editmode](/screenshots/edit.png)

* Shows when a different user is editing.

