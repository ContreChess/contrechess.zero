# Data Structures

Because the games data is user generated most data will have a root of:
data/users/

| files         | path                     | comments                               |
| -----         | ----                     | --------                               |
| user          | */user.json              | optionally contains bitmessage address |
| avatar        | */avatar.jpg             |                                        |
| public key    | */pgp.asc                |                                        |
| email         | */email.asc              | pgp signed                             |
| offers        | */offers/<user>/<uuid>   | <uuid>.asc                             |
| rejections    | */rejections/<uuid>.asc  | empty plain text file                  |
| games         | */games/<uuid>/<timestamp>.pgn.asc  |                             |
| comments      | */games/<uuid>/comments/<timestamp>.asc |                         |
| redeem script | */games/<uuid>/redeem.asc|                                        |
| transaction   | */games/<uuid>/transaction.<timestamp>.asc |                      |
 


**Each encrypted, timestamped, signed pgn file contains a comment with the hash of previous un-encrypted pgn file to keep a continuous chain going (since each file is signed and encrypted it could only have been generated on the machine of the user who has authority to read the previous file''s unencrypted content.


