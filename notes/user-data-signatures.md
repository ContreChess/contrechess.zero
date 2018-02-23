# User Data Signatures

This application relies on cryptographic signatures pretty heavily. It's important that each user can encrypt a message intended for a specific recipient but it's equally important that recipients can be reasonably assured of each messages provenance.

Since the application runs in the browser there are a couple of options for allowing senders to sign messages.

1. Provide a prompt for users to acquire messages before publishing to the greater zeronet network. Allowing them to sign messages outside of the browser.
2. Provide a form for users to temporarily place their private key in application memory to allow the system to sign messages on their behalf.
3. Provide a form for users to persistently place their private key in localStorage or IndexDB.
  a. Most people generate pgp key pairs with pass phrases (and system generated keys require them). This means there are even more permutations for enabling system signature on the user's behalf.
    i. Users can opt to enter a passphrase for every message,
    ii. or they can have their passphrase live in transient memory and reenter it given a certain timeframe or upon closure of the window.
    
(Signatures require the private key in the pair, while encryption only requires public keys).
(I'm not comfortable storing the users passphrase any longer than a windows lifetime).

