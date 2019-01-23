const people = [
  {"_id":"5bce02fc4df8a32e9026e655","parents":["5bce2777baeb9a33af071f4e","5bce373798a95a3531041618"],"spouses":["5bce02ff4df8a32e9026e656"],"children":["5bce02694df8a32e9026e654","5bdb5332d1ad7f032236f433"],"private":true,"name":"JN","customId":"5bce02fc4df8a32e9026e655"},
  {"_id":"5bce02ff4df8a32e9026e656","parents":["5bce353ce5651a33f85077a8","5bce2799548af033b53ada64"],"spouses":["5bce02fc4df8a32e9026e655"],"children":["5bce02694df8a32e9026e654","5bdb5332d1ad7f032236f433"],"private":true,"name":"SP","customId":"5bce02ff4df8a32e9026e656"},
  {"_id":"5bce0765bcc4162f3eef1c6e","parents":["5bce0782bcc4162f3eef1c70","5bce0788bcc4162f3eef1c71"],"spouses":["5bce0777bcc4162f3eef1c6f","5bdb56d4d5b7c70394449f4e"],"children":["5bce360be5651a33f85077a9","5bce37c698a95a353104161b"],"private":false,"name":"Ole B. Johnson","customId":"OleJohnson","links":["http://lundbergancestry.wikia.com/wiki/Ole_Johnson_%26_Anna_Young Lundberg Ancestry","https://www.familysearch.org/tree/person/details/L2CW-MTL FamilySearch profile","https://www.findagrave.com/cgi-bin/fg.cgi?page=gr&GRid=68151408 FindAGrave","https://www.ancestry.com/family-tree/person/tree/48082533/person/150118414506 Ancestry"]},
  {"_id":"5bce0777bcc4162f3eef1c6f","parents":[],"spouses":["5bce0765bcc4162f3eef1c6e"],"children":["5bce360be5651a33f85077a9","5bce37c698a95a353104161b"],"private":false,"name":"Anna Christina Young","customId":"AnnaChristinaYoung","links":["http://lundbergancestry.wikia.com/wiki/Ole_Johnson_%26_Anna_Young Lundberg","https://www.familysearch.org/tree/person/details/LRSH-239 FamilySearch","https://www.ancestry.com/family-tree/person/tree/48082533/person/150118414555/facts Ancestry","https://www.findagrave.com/memorial/68149529 FindAGrave"]},
  {"_id":"5bce0782bcc4162f3eef1c70","parents":[],"spouses":["5bce0788bcc4162f3eef1c71"],"children":["5bce0765bcc4162f3eef1c6e","5bce391898a95a353104161d","5bce393f98a95a353104161e","5bce395998a95a353104161f","5bce397a98a95a3531041620","5bce398b98a95a3531041621"],"private":false,"name":"Johan Pedersen","customId":"JohanPedersen","links":["http://lundbergancestry.wikia.com/wiki/Johan_Pedersen_%26_Barbara_Hansen","https://familysearch.org/tree/person/KZLH-B8S","https://www.findagrave.com/memorial/194215408"]},
  {"_id":"5bce0788bcc4162f3eef1c71","parents":["5bcf68d5c6dc880b399381bb","5bcf68dbc6dc880b399381bc"],"spouses":["5bce0782bcc4162f3eef1c70"],"children":["5bce391898a95a353104161d","5bce393f98a95a353104161e","5bce395998a95a353104161f","5bce0765bcc4162f3eef1c6e","5bce397a98a95a3531041620","5bce398b98a95a3531041621"],"private":false,"name":"Barbara Margrethe Hansen","customId":"BarbaraMargretheHansen","links":["https://familysearch.org/tree/person/K8LH-Z9J FamilySearch","https://www.findagrave.com/memorial/68150818/margrete-johnson FindAGrave","http://lundbergancestry.wikia.com/wiki/Johan_Pedersen_%26_Barbara_Hansen Lundberg","https://www.familysearch.org/ark:/61903/1:1:MQF8-LCB MN 1885 census (maybe her; probably not. right-ish name; right bday/bplace; same page as Ole; but not sure why she would be with this family)"]},
  {"_id":"5bce2777baeb9a33af071f4e","parents":["5bce39cf98a95a3531041622","5bce39e198a95a3531041623"],"spouses":["5bce373798a95a3531041618"],"children":["5bce02fc4df8a32e9026e655"],"private":true,"name":"PN","customId":"5bce2777baeb9a33af071f4e"},
  {"_id":"5bce2799548af033b53ada64","parents":["5bce374d98a95a3531041619","5bce36ec98a95a3531041617"],"spouses":["5bce353ce5651a33f85077a8","5bfb7d3dd1b0f00fdfabf5eb"],"children":["5bce02ff4df8a32e9026e656","5bec906bffb349d8b25b1fe4"],"private":false,"name":"Carol Johnson","customId":"CarolJohnson","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/20065122349 Ancestry"]},
  {"_id":"5bce353ce5651a33f85077a8","parents":["5bd343fb1b886c32001d826f","5bd3440b1b886c32001d8270"],"spouses":["5bce2799548af033b53ada64","5bfe0d738db6d0026a28ab2a"],"children":["5bce02ff4df8a32e9026e656","5bec906bffb349d8b25b1fe4"],"private":false,"name":"Gordon Fencil","customId":"GordonFencil","links":["https://www.familysearch.org/tree/person/details/LVSB-JR2 FamilySearch","https://www.findagrave.com/memorial/189328755 FindAGrave","https://www.ancestry.com/family-tree/person/tree/48082533/person/20065122667/facts Ancestry"]},
  {"_id":"5bce360be5651a33f85077a9","parents":["5bce0765bcc4162f3eef1c6e","5bce0777bcc4162f3eef1c6f"],"spouses":["5bce365ce5651a33f85077aa"],"children":["5bce3683e5651a33f85077ab","5bce36ec98a95a3531041617","5bd1dfed2d746f23c44e5137","5bd1e0322d746f23c44e5138","5bd1e07c2d746f23c44e5139"],"private":false,"name":"Oscar E. Johnson","customId":"OscarJohnson","links":["http://lundbergancestry.wikia.com/wiki/Oscar_Johnson_%26_Maggie_Olsen Lundberg","https://www.findagrave.com/memorial/68151422/oscar-emil-johnson FindAGrave"]},
  {"_id":"5bce365ce5651a33f85077aa","parents":["5bd2012c2d746f23c44e5166","5bd201312d746f23c44e5167"],"spouses":["5bce360be5651a33f85077a9"],"children":["5bce3683e5651a33f85077ab","5bce36ec98a95a3531041617","5bd1dfed2d746f23c44e5137","5bd1e0322d746f23c44e5138","5bd1e07c2d746f23c44e5139"],"private":false,"name":"Magdalena Christina \"Maggie\" Olsen","customId":"MaggieOlsen","links":["https://www.familysearch.org/tree/person/details/9KM8-BBH FamilySearch","http://lundbergancestry.wikia.com/wiki/Oscar_Johnson_%26_Maggie_Olsen Lundberg"]},
  {"_id":"5bce36ec98a95a3531041617","parents":["5bce360be5651a33f85077a9","5bce365ce5651a33f85077aa"],"spouses":["5bce374d98a95a3531041619"],"children":["5bce2799548af033b53ada64","5be4bef15b365cadb48c44eb","5be4bf135b365cadb48c44ec","5be4bf305b365cadb48c44ed"],"private":false,"name":"Violet E. Johnson","customId":"VioletJohnson","links":["https://www.findagrave.com/memorial/846831 FindAGrave","https://www.familysearch.org/tree/person/details/LVSB-V18 FamilySearch","https://lundbergancestry.wikia.com/wiki/Leslie_Johnson_%26_Violet_Johnson Lundberg"]},
  {"_id":"5bce373798a95a3531041618","parents":["5bcfc4760a62a6125f8edeca","5bcfc4c30a62a6125f8edecb"],"spouses":["5bce2777baeb9a33af071f4e"],"children":["5bce02fc4df8a32e9026e655"],"private":true,"name":"MM","customId":"5bce373798a95a3531041618"},
  {"_id":"5bce374d98a95a3531041619","parents":["5bd35cab1b886c32001d82ca","5bd35cbc1b886c32001d82cb"],"spouses":["5bce36ec98a95a3531041617"],"children":["5bce2799548af033b53ada64","5be4bef15b365cadb48c44eb","5be4bf135b365cadb48c44ec","5be4bf305b365cadb48c44ed"],"private":false,"name":"Leslie Helmer Johnson, Sr.","customId":"LeslieHelmerJohnson","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/28205906290 Ancestry","https://www.findagrave.com/memorial/843831 FindAGrave","https://www.familysearch.org/tree/person/LVSB-VYR FamilySearch","https://lundbergancestry.wikia.com/wiki/Leslie_Johnson_%26_Violet_Johnson Lundberg"]},
  {"_id":"5bce39cf98a95a3531041622","parents":["5bce3a1398a95a3531041626","5bce3a1898a95a3531041627"],"spouses":["5bce39e198a95a3531041623"],"children":["5bedecd3aefceb046155d360","5bedece3aefceb046155d361","5bebaffdffb349d8b25b1fb9","5bce2777baeb9a33af071f4e","5bebb73affb349d8b25b1fbc","5bebbd1fffb349d8b25b1fbf","5bebbcfcffb349d8b25b1fbe","5bebbd3fffb349d8b25b1fc0"],"private":false,"name":"Oscar Leroy Nyberg","customId":"OscarNyberg","links":["https://www.findagrave.com/memorial/52017905 FindAGrave","https://www.familysearch.org/tree/person/details/LV3Q-67L FamilySearch","https://www.ancestry.com/family-tree/person/tree/48082533/person/20065185551/facts Ancestry"]},
  {"_id":"5bce39e198a95a3531041623","parents":["5bce39e598a95a3531041624","5bce39e998a95a3531041625"],"spouses":["5bce39cf98a95a3531041622"],"children":["5bce2777baeb9a33af071f4e","5bebaffdffb349d8b25b1fb9","5bebb73affb349d8b25b1fbc","5bebbcfcffb349d8b25b1fbe","5bebbd1fffb349d8b25b1fbf","5bebbd3fffb349d8b25b1fc0","5bedecd3aefceb046155d360","5bedece3aefceb046155d361"],"private":false,"name":"Wilma Frieda Winblad [Nyberg]","customId":"WilmaWinblad","links":[]},
  {"_id":"5bce39e598a95a3531041624","parents":["5bd1e3b22d746f23c44e513e","5bd1e3bf2d746f23c44e513f"],"spouses":["5bce39e998a95a3531041625"],"children":["5bce39e198a95a3531041623"],"private":false,"name":"William Fridolf Winblad","customId":"WilliamWinblad","links":["http://lundbergancestry.wikia.com/wiki/William_Winblad_%26_Rena_Koksma Lundberg","https://www.familysearch.org/tree/person/details/L2QV-448 FamilySearch","https://www.findagrave.com/memorial/148818012 FindAGrave","https://www.ancestry.com/family-tree/person/tree/48082533/person/28206691042/facts Ancestry"]},
  {"_id":"5bce39e998a95a3531041625","parents":["5be4cc845b365cadb48c44f7","5be4cc925b365cadb48c44f8"],"spouses":["5bce39e598a95a3531041624"],"children":["5bce39e198a95a3531041623"],"private":false,"name":"Rena Koksma [Winblad]","customId":"RenaKoksma","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/28206607597 Ancestry","https://www.familysearch.org/tree/person/LC65-YGD FamilySearch","https://www.findagrave.com/memorial/52018562 FindAGrave"]},
  {"_id":"5bce3a1398a95a3531041626","parents":["5bcf8c975ed54e0e326b76f1","5bcf8ca55ed54e0e326b76f2"],"spouses":["5bce3a1898a95a3531041627"],"children":["5bce39cf98a95a3531041622","5bd22313a4d3c928ab992f07","5beba5e0ffb349d8b25b1fb2","5bebaa13ffb349d8b25b1fb4","5bebaaefffb349d8b25b1fb5","5bebbe57ffb349d8b25b1fc1"],"private":false,"name":"Peter Hakansson Nyberg","customId":"PeterNyberg","links":["https://www.findagrave.com/memorial/139521398/peter-hakansson-nyberg FindAGrave","http://lundbergancestry.wikia.com/wiki/Peter_Nyberg_%26_Ellen_Lundberg Lundberg","https://www.familysearch.org/tree/person/details/LHDT-NCD Ancestry"]},
  {"_id":"5bce3a1898a95a3531041627","parents":[],"spouses":["5bce3a1398a95a3531041626"],"children":["5bce39cf98a95a3531041622","5bd22313a4d3c928ab992f07","5beba5e0ffb349d8b25b1fb2","5bebaa13ffb349d8b25b1fb4","5bebaaefffb349d8b25b1fb5","5bebbe57ffb349d8b25b1fc1"],"private":false,"name":"Ellen Christina Lundberg [Nyberg]","customId":"EllenChristinaLundberg","links":["http://lundbergancestry.wikia.com/wiki/Peter_Nyberg_%26_Ellen_Lundberg Lundberg","https://www.findagrave.com/memorial/139521529 FindAGrave"]},
  {"_id":"5bcf68d5c6dc880b399381bb","parents":[],"spouses":["5bcf68dbc6dc880b399381bc"],"children":["5bce0788bcc4162f3eef1c71"],"private":false,"name":"Hans Jensen","customId":"HansJensen","links":[]},
  {"_id":"5bcf68dbc6dc880b399381bc","parents":[],"spouses":["5bcf68d5c6dc880b399381bb"],"children":["5bce0788bcc4162f3eef1c71"],"private":false,"name":"Karen Nielsdr","customId":"KarenNielsdr","links":[]},
  {"_id":"5bcf8c975ed54e0e326b76f1","parents":[],"spouses":["5bcf8ca55ed54e0e326b76f2"],"children":["5bce3a1398a95a3531041626","5bebc0baffb349d8b25b1fc2"],"private":false,"name":"Håkan Olsson","customId":"HakanOlsson","links":[]},
  {"_id":"5bcf8ca55ed54e0e326b76f2","parents":[],"spouses":["5bcf8c975ed54e0e326b76f1"],"children":["5bce3a1398a95a3531041626","5bebc0baffb349d8b25b1fc2"],"private":false,"name":"Hanna Svensdotter","customId":"HannaSvensdotter","links":[]},
  {"_id":"5bcfc4760a62a6125f8edeca","parents":[],"spouses":["5bcfc4c30a62a6125f8edecb"],"children":["5bce373798a95a3531041618"],"private":false,"name":"Maurice Miller","customId":"MauriceMiller","links":[]},
  {"_id":"5bcfc4c30a62a6125f8edecb","parents":["5bd4fc14e13be137845b4df4","5bd4fc1de13be137845b4df5"],"spouses":["5bcfc4760a62a6125f8edeca"],"children":["5bce373798a95a3531041618"],"private":true,"name":"Marie Antoinette Clifton","customId":"5bcfc4c30a62a6125f8edecb"},
  {"_id":"5bd1e3b22d746f23c44e513e","parents":["5bef4edd230d390c7819b722","5bef4eed230d390c7819b723"],"spouses":["5bd1e3bf2d746f23c44e513f"],"children":["5bce39e598a95a3531041624","5bd1e9132d746f23c44e5153","5bd1e92d2d746f23c44e5154","5bd1e9512d746f23c44e5155","5bd1e9942d746f23c44e5157","5bd1e99a2d746f23c44e5158","5bd1e9a92d746f23c44e5159"],"private":false,"name":"Peter August Svensson Winblad","customId":"PeterWinblad","links":["http://lundbergancestry.wikia.com/wiki/Peter_Winblad_%26_Clara_Magnuson Lundberg","https://www.familysearch.org/tree/person/L2QV-67R FamilySearch","https://www.findagrave.com/memorial/156163448 FindAGrave"]},
  {"_id":"5bd1e3bf2d746f23c44e513f","parents":["5bef393a230d390c7819b707","5bef3943230d390c7819b708"],"spouses":["5bd1e3b22d746f23c44e513e"],"children":["5bce39e598a95a3531041624","5bd1e9132d746f23c44e5153","5bd1e92d2d746f23c44e5154","5bd1e9512d746f23c44e5155","5bd1e9942d746f23c44e5157","5bd1e99a2d746f23c44e5158","5bd1e9a92d746f23c44e5159"],"private":false,"name":"Clara Magnuson [Winblad]","customId":"ClaraMagnuson","links":["https://familysearch.org/tree/person/L2QV-6X7 FamilySearch","https://www.findagrave.com/cgi-bin/fg.cgi?page=gr&GRid=156163381 FindAGrave","http://lundbergancestry.wikia.com/wiki/Peter_Winblad_%26_Clara_Magnuson Lundberg","https://www.ancestry.com/family-tree/person/tree/48082533/person/150103090784/facts Ancestry"]},
  {"_id":"5bd2012c2d746f23c44e5166","parents":[],"spouses":["5bd201312d746f23c44e5167"],"children":["5bce365ce5651a33f85077aa","5bd206210d0fc526d2fe9d95","5bd207360d0fc526d2fe9d9e","5bd20822841e3e270aefb8f8","5bd208430646cc270e422661","5bd208600646cc270e422662","5bd208780646cc270e422663"],"private":false,"name":"Kristen Olsen","customId":"KristenOlsen","links":["http://lundbergancestry.wikia.com/wiki/Kristen_Olsen_%26_Bengta_Petersen Lundberg"]},
  {"_id":"5bd201312d746f23c44e5167","parents":[],"spouses":["5bd2012c2d746f23c44e5166"],"children":["5bce365ce5651a33f85077aa","5bd206210d0fc526d2fe9d95","5bd207360d0fc526d2fe9d9e","5bd20822841e3e270aefb8f8","5bd208430646cc270e422661","5bd208600646cc270e422662","5bd208780646cc270e422663"],"private":false,"name":"Bengta Petersen","customId":"BengtaPetersen","links":["http://lundbergancestry.wikia.com/wiki/Kristen_Olsen_%26_Bengta_Petersen Lundberg","http://www.findagrave.com/cgi-bin/fg.cgi?page=gr&GRid=68485577 FindAGrave"]},
  {"_id":"5bd343fb1b886c32001d826f","parents":["5bd34d0a1b886c32001d8297","5bd34d131b886c32001d8298"],"spouses":["5bd3440b1b886c32001d8270"],"children":["5bce353ce5651a33f85077a8","5bd3477c1b886c32001d827e","5bd347c21b886c32001d827f","5bd347d71b886c32001d8280"],"private":false,"name":"Harry Fencil","customId":"HarryFencil","links":["http://lundbergancestry.wikia.com/wiki/Gladys_Mae_Spaulding Lundberg","https://www.findagrave.com/memorial/69005393 FindAGrave","https://www.ancestry.com/family-tree/person/tree/48082533/person/28206302297/facts Ancestry","https://www.familysearch.org/tree/person/details/9MQ2-VJG FamilySearch"]},
  {"_id":"5bd3440b1b886c32001d8270","parents":["5bd8b5a3fabf974800901bdb","5bd8b5abfabf974800901bdc"],"spouses":["5bd344d51b886c32001d8273","5bd343fb1b886c32001d826f"],"children":["5bd3468c1b886c32001d827a","5bd346fc1b886c32001d827c","5bce353ce5651a33f85077a8","5bd3477c1b886c32001d827e","5bd347c21b886c32001d827f","5bd347d71b886c32001d8280"],"private":false,"name":"Gladys Mae Spaulding [Allen Fencil]","customId":"GladysMaeSpaulding","links":["http://lundbergancestry.wikia.com/wiki/Gladys_Mae_Spaulding Lundberg","https://www.findagrave.com/memorial/69005407 FindAGrave"]},
  {"_id":"5bd34d0a1b886c32001d8297","parents":[],"spouses":["5bd34d131b886c32001d8298"],"children":["5bd34e9e1b886c32001d829d","5bd34f0c1b886c32001d82a0","5bd352f31b886c32001d82a3","5bd353601b886c32001d82a6","5bd353d51b886c32001d82a9","5bd354441b886c32001d82ac","5bd354b21b886c32001d82af","5bd355f61b886c32001d82b5","5bd3569a1b886c32001d82b8","5bd343fb1b886c32001d826f","5bd357321b886c32001d82bb","5bd357751b886c32001d82be"],"private":false,"name":"Frank Fencl","customId":"FrankFencl","links":["http://lundbergancestry.wikia.com/wiki/Frank_Fencl_%26_Christina_Karas","https://familysearch.org/tree/person/LC2X-GZY","https://www.findagrave.com/memorial/32413093"]},
  {"_id":"5bd34d131b886c32001d8298","parents":[],"spouses":["5bd34d0a1b886c32001d8297"],"children":["5bd34e9e1b886c32001d829d","5bd34f0c1b886c32001d82a0","5bd352f31b886c32001d82a3","5bd353601b886c32001d82a6","5bd353d51b886c32001d82a9","5bd354441b886c32001d82ac","5bd354b21b886c32001d82af","5bd355f61b886c32001d82b5","5bd3569a1b886c32001d82b8","5bd343fb1b886c32001d826f","5bd357321b886c32001d82bb","5bd357751b886c32001d82be"],"private":false,"name":"Celestina \"Christina\" Karas","customId":"ChristinaKaras","links":["http://lundbergancestry.wikia.com/wiki/Frank_Fencl_%26_Christina_Karas Lundberg","https://www.familysearch.org/tree/person/LHB1-CHB FamilySearch"]},
  {"_id":"5bd35cab1b886c32001d82ca","parents":[],"spouses":["5bd35cbc1b886c32001d82cb"],"children":["5bce374d98a95a3531041619","5bd9cbc64d3a6a4ba8038bbe","5bd9cbe64d3a6a4ba8038bbf","5bd9cc0b4d3a6a4ba8038bc0","5bd9cc2f4d3a6a4ba8038bc1","5bd9cc4c4d3a6a4ba8038bc2","5bd9cc5e4d3a6a4ba8038bc3"],"private":false,"name":"Victor Frank Johnson","customId":"VictorFrankJohnson","links":["https://www.familysearch.org/tree/person/L2C8-X8N FamilySearch","https://www.findagrave.com/memorial/50527966 FindAGrave","http://lundbergancestry.wikia.com/wiki/Victor_Johnson_%26_Anna_Petterson Lundberg"]},
  {"_id":"5bd35cbc1b886c32001d82cb","parents":[],"spouses":["5bd35cab1b886c32001d82ca"],"children":["5bce374d98a95a3531041619","5bd9cbc64d3a6a4ba8038bbe","5bd9cbe64d3a6a4ba8038bbf","5bd9cc0b4d3a6a4ba8038bc0","5bd9cc2f4d3a6a4ba8038bc1","5bd9cc4c4d3a6a4ba8038bc2","5bd9cc5e4d3a6a4ba8038bc3"],"private":false,"name":"Anna Sophia Petterson","customId":"AnnaSophiaPetterson","links":["https://www.familysearch.org/tree/person/L2C8-X6H FamilySearch","http://lundbergancestry.wikia.com/wiki/Victor_Johnson_%26_Anna_Petterson Lundberg","https://www.findagrave.com/memorial/50527974 FindAGrave"]},
  {"_id":"5bd4fc14e13be137845b4df4","parents":["5bd4fcf9e13be137845b4df8","5bd4fdffe13be137845b4dfb"],"spouses":["5bd4fc1de13be137845b4df5"],"children":["5bcfc4c30a62a6125f8edecb","5bfc55fcf4dcf91ef9c07af4"],"private":false,"name":"John Quincy Clifton","customId":"JohnQuincyClifton","links":["https://www.findagrave.com/memorial/59878669 FindAGrave","https://www.familysearch.org/tree/person/details/LV48-SMX FamilySearch"]},
  {"_id":"5bd4fc1de13be137845b4df5","parents":[],"spouses":["5bd4fc14e13be137845b4df4"],"children":["5bcfc4c30a62a6125f8edecb","5bfc55fcf4dcf91ef9c07af4"],"private":false,"name":"Ola V. Martin [Clifton]","customId":"OlaMartin","links":[]},
  {"_id":"5bd4fcf9e13be137845b4df8","parents":["5bd87fbfcc007145c39c8fa1","5bd87fc4cc007145c39c8fa2"],"spouses":["5bd4fdffe13be137845b4dfb"],"children":["5bd4fc14e13be137845b4df4"],"private":false,"name":"Harrison Clifton","customId":"HarrisonClifton","links":["https://www.findagrave.com/memorial/59878422 FindAGrave","https://www.familysearch.org/tree/person/LCX3-CYD FamilySearch","https://www.ancestry.com/family-tree/person/tree/48082533/person/28041211133/facts Ancestry"]},
  {"_id":"5bd4fdffe13be137845b4dfb","parents":["5bd624d9e13be137845b4dfe","5bd624e4e13be137845b4dff"],"spouses":["5bd4fcf9e13be137845b4df8"],"children":["5bd4fc14e13be137845b4df4"],"private":false,"name":"Frances Rebecca “Fannie” Smith [Clifton]","customId":"FannieSmith","links":[]},
  {"_id":"5bd624d9e13be137845b4dfe","parents":["5bd625bee13be137845b4e00","5bd627c3e13be137845b4e04"],"spouses":["5bd624e4e13be137845b4dff"],"children":["5bd4fdffe13be137845b4dfb","5bec78aaffb349d8b25b1fca"],"private":false,"name":"Sheldon Perkins Smith","customId":"SheldonPerkinsSmith","links":["https://www.wikitree.com/wiki/Smith-42649 WikiTree","https://www.findagrave.com/memorial/12272311 FindAGrave","https://www.ancestry.com/family-tree/person/tree/48082533/person/28206581155 Ancestry","https://www.familysearch.org/tree/person/L1HG-87N FamilySearch","http://lundbergancestry.wikia.com/wiki/Sheldon_Smith_%26_Frances_Bell Lundberg"]},
  {"_id":"5bd624e4e13be137845b4dff","parents":["5bd7523de13be137845b4e89","5bd75bffe13be137845b4ea4"],"spouses":["5bd624d9e13be137845b4dfe"],"children":["5bd4fdffe13be137845b4dfb","5bec78aaffb349d8b25b1fca"],"private":false,"name":"Frances Elizabeth Bell [Smith]","customId":"FrancesBell","links":["https://www.findagrave.com/memorial/12272277 FindAGrave","https://www.familysearch.org/tree/person/L6CL-TFD FamilySearch","https://www.ancestry.com/family-tree/person/tree/48082533/person/28206581156 Ancestry"]},
  {"_id":"5bd625bee13be137845b4e00","parents":[],"spouses":["5bd627c3e13be137845b4e04","5bfb2d3ed1b0f00fdfabf5cf"],"children":["5bd624d9e13be137845b4dfe"],"private":false,"name":"Captain Nicholas Peck Smith","customId":"NicholasSmith","links":["https://www.findagrave.com/memorial/12272289 FindAGrave","https://www.wikitree.com/wiki/Smith-42380 WikiTree","https://www.ancestry.com/family-tree/person/tree/48082533/person/28207024185/facts Ancestry","https://www.familysearch.org/tree/person/details/KD3D-YTL FamilySearch","https://lundbergancestry.wikia.com/wiki/Nicholas_Peck_Smith Lundberg"]},
  {"_id":"5bd627c3e13be137845b4e04","parents":["5bd63134e13be137845b4e14","5bd64194e13be137845b4e2b"],"spouses":["5bd62965e13be137845b4e07","5bd625bee13be137845b4e00"],"children":["5bd624d9e13be137845b4dfe"],"private":false,"name":"Urania Tourtellot \"Annie\" Aborn [Smith]","customId":"UraniaAborn","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/28207024209 Ancestry"]},
  {"_id":"5bd7523de13be137845b4e89","parents":[],"spouses":["5bd75247e13be137845b4e8a","5bd75bffe13be137845b4ea4"],"children":["5bd624e4e13be137845b4dff","5bd75e8ce13be137845b4ea8"],"private":false,"name":"Joseph J. Bell","customId":"JosephBell","links":["https://www.familysearch.org/tree/person/LZNK-YGP FamilySearch","https://www.familysearch.org/ark:/61903/1:1:FW4P-8JX FamilySearch - Georgia Marriages (maybe him; 1823)","https://www.ancestry.com/family-tree/person/tree/48082533/person/150152317257 Ancestry"]},
  {"_id":"5bd75bffe13be137845b4ea4","parents":[],"spouses":["5bd7523de13be137845b4e89"],"children":["5bd624e4e13be137845b4dff","5bd75e8ce13be137845b4ea8"],"private":false,"name":"Elizabeth Johnson [Bell]","customId":"ElizabethJohnsonBell","links":[]},
  {"_id":"5bd87fbfcc007145c39c8fa1","parents":["5bd89606cc007145c39c8fd5","5bd89614cc007145c39c8fd6"],"spouses":["5bd87fc4cc007145c39c8fa2"],"children":["5bd4fcf9e13be137845b4df8","5bd881edcc007145c39c8fab","5be9ae7036433ab6d5cca5ff","5be9a03336433ab6d5cca5f6"],"private":false,"name":"William Clifton","customId":"WilliamClifton1803","links":["https://www.findagrave.com/memorial/59879359 FindAGrave","https://www.familysearch.org/tree/person/LLWZ-HRQ FamilySearch","https://lundbergancestry.wikia.com/wiki/William_Clifton_%26_Susan_Sharpe Lundberg","https://www.ancestry.com/family-tree/person/tree/48082533/person/28041211432/facts Ancestry"]},
  {"_id":"5bd87fc4cc007145c39c8fa2","parents":["5bd89b17bc01d746cbe19e47","5bfb2828d1b0f00fdfabf5c3"],"spouses":["5bd87fbfcc007145c39c8fa1"],"children":["5bd4fcf9e13be137845b4df8","5bd881edcc007145c39c8fab","5be9ae7036433ab6d5cca5ff","5be9a03336433ab6d5cca5f6"],"private":false,"name":"Susan Sharpe [Clifton]","customId":"SusanSharpe","links":["https://www.findagrave.com/memorial/59879140 FindAGrave","https://www.familysearch.org/tree/person/MMFR-KQP FamilySearch","https://lundbergancestry.wikia.com/wiki/William_Clifton_%26_Susan_Sharpe Lundberg"]},
  {"_id":"5bd89606cc007145c39c8fd5","parents":[],"spouses":["5bd89614cc007145c39c8fd6"],"children":["5bd87fbfcc007145c39c8fa1"],"private":false,"name":"Ezekiel Clifton (1773)","customId":"EzekielClifton1773","links":["https://www.familysearch.org/tree/person/2781-RVV FamilySearch","https://www.findagrave.com/memorial/104919098 FindAGrave"]},
  {"_id":"5bd89614cc007145c39c8fd6","parents":[],"spouses":["5bd89606cc007145c39c8fd5"],"children":["5bd87fbfcc007145c39c8fa1"],"private":false,"name":"Elizabeth Roberts [Clifton]","customId":"ElizabethRoberts","links":[]},
  {"_id":"5bd89b17bc01d746cbe19e47","parents":["5bfb293dd1b0f00fdfabf5c9"],"spouses":["5bfb2828d1b0f00fdfabf5c3"],"children":["5bd87fc4cc007145c39c8fa2","5bfb27f1d1b0f00fdfabf5c2"],"private":false,"name":"Maj. John T. Sharpe","customId":"JohnTSharpe","links":["https://www.familysearch.org/tree/person/LLWZ-8KF FamilySearch"]},
  {"_id":"5bd8b5a3fabf974800901bdb","parents":["5c277fdc941fae0368f62e02","5c277fe6941fae0368f62e03"],"spouses":["5bd8b5abfabf974800901bdc"],"children":["5bd3440b1b886c32001d8270","5be9071b36433ab6d5cca5f2","5bfd7c6e8db6d0026a28aafa"],"private":false,"name":"John Spaulding","customId":"JohnSpaulding1882","links":["http://lundbergancestry.wikia.com/wiki/John_Spaulding_%26_Cora_Day Lundberg","https://www.findagrave.com/memorial FindAGrave","https://www.familysearch.org/tree/person/9X6V-LHN FamilySearch"]},
  {"_id":"5bd8b5abfabf974800901bdc","parents":["5bd8bcf8fabf974800901bf1","5bd8bd03fabf974800901bf2"],"spouses":["5bd8b5a3fabf974800901bdb"],"children":["5bd3440b1b886c32001d8270","5be9071b36433ab6d5cca5f2","5bfd7c6e8db6d0026a28aafa"],"private":false,"name":"Cora Agnes Day [Spaulding]","customId":"CoraAgnesDay[Spaulding]","links":["http://lundbergancestry.wikia.com/wiki/John_Spaulding_%26_Cora_Day Lundberg","https://www.findagrave.com/memorial FindAGrave","https://www.familysearch.org/tree/person/KFY2-1GV FamilySearch"]},
  {"_id":"5bd8bcf8fabf974800901bf1","parents":["5beb67fe188f87d2b59f9dbc","5beb680a188f87d2b59f9dbd"],"spouses":["5bd8bd03fabf974800901bf2"],"children":["5bd8b5abfabf974800901bdc"],"private":false,"name":"Silas Brant Day","customId":"SilasBrantDay","links":["https://www.findagrave.com/memorial/54799142 FindAGrave"]},
  {"_id":"5bd8bd03fabf974800901bf2","parents":["5be349f58e201ba60d0c2d2a"],"spouses":["5bd8bcf8fabf974800901bf1"],"children":["5bd8b5abfabf974800901bdc"],"private":false,"name":"Mary Ellen Vanausdall [Day]","customId":"MaryEllenVanausdall","links":["https://www.findagrave.com/memorial/54799108 FindAGrave","https://www.ancestry.com/family-tree/person/tree/48082533/person/28216347119 Ancestry"]},
  {"_id":"5be349f58e201ba60d0c2d2a","parents":[],"spouses":[],"children":["5bd8bd03fabf974800901bf2","5be34b118e201ba60d0c2d2b"],"private":false,"name":"Caleb Vanausdall","customId":"CalebVanausdall","links":[]},
  {"_id":"5be4cc845b365cadb48c44f7","parents":[],"spouses":["5be4cc925b365cadb48c44f8"],"children":["5bce39e998a95a3531041625","5be4d25a5b365cadb48c44fd"],"private":false,"name":"John Koksma","customId":"JohnKoksma","links":[]},
  {"_id":"5be4cc925b365cadb48c44f8","parents":[],"spouses":["5be4cc845b365cadb48c44f7"],"children":["5bce39e998a95a3531041625","5be4d25a5b365cadb48c44fd"],"private":false,"name":"Femke [Koksma]","customId":"FemkeKoksma","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/28206607875 Ancestry"]},
  {"_id":"5beb67fe188f87d2b59f9dbc","parents":["5beb7418188f87d2b59f9dc5"],"spouses":["5beb680a188f87d2b59f9dbd"],"children":["5bd8bcf8fabf974800901bf1","5beb698b188f87d2b59f9dc3","5bec872bffb349d8b25b1fdf"],"private":false,"name":"Jeduthan Day","customId":"JeduthanDay","links":["https://lundbergancestry.wikia.com/wiki/Jeduthan_Day_%26_Mary_Grimes Lundberg","https://www.findagrave.com/memorial/54878425 FindAGrave","https://www.ancestry.com/family-tree/person/tree/48082533/person/150128893058/facts Ancestry","https://www.familysearch.org/tree/person/details/2X9B-9ZB FamilySearch"]},
  {"_id":"5beb680a188f87d2b59f9dbd","parents":[],"spouses":["5beb67fe188f87d2b59f9dbc"],"children":["5bd8bcf8fabf974800901bf1","5beb698b188f87d2b59f9dc3","5bec872bffb349d8b25b1fdf"],"private":false,"name":"Mary Grimes [Day]","customId":"MaryGrimes","links":["https://lundbergancestry.wikia.com/wiki/Jeduthan_Day_%26_Mary_Grimes Lundberg","https://www.findagrave.com/memorial/54878426 FindAGrave","https://www.ancestry.com/family-tree/person/tree/48082533/person/28216347125/facts Ancestry","https://www.familysearch.org/tree/person/details/KZKY-SDY FamilySearch"]},
  {"_id":"5beb7418188f87d2b59f9dc5","parents":[],"spouses":[],"children":["5beb67fe188f87d2b59f9dbc"],"private":false,"name":"Silas Day","customId":"SilasDay1783","links":["https://www.familysearch.org/tree/person/details/KJ3S-VRB FamilySearch"]},
  {"_id":"5bef393a230d390c7819b707","parents":[],"spouses":["5bef3943230d390c7819b708"],"children":["5bd1e3bf2d746f23c44e513f"],"private":false,"name":"Magnus Sten","customId":"MagnusSten","links":[]},
  {"_id":"5bef3943230d390c7819b708","parents":[],"spouses":["5bef393a230d390c7819b707"],"children":["5bd1e3bf2d746f23c44e513f"],"private":false,"name":"Anna Marie Peterson","customId":"AnnaMariePeterson","links":[]},
  {"_id":"5bef4edd230d390c7819b722","parents":[],"spouses":["5bef4eed230d390c7819b723"],"children":["5bd1e3b22d746f23c44e513e","5bf07545230d390c7819b724","5bf0758a230d390c7819b725"],"private":false,"name":"Sven Johan Petersson","customId":"SvenJohanPetersson","links":["https://www.familysearch.org/tree/person/details/LTC8-LV7 FamilySearch"]},
  {"_id":"5bfb2828d1b0f00fdfabf5c3","parents":[],"spouses":["5bd89b17bc01d746cbe19e47"],"children":["5bd87fc4cc007145c39c8fa2","5bfb27f1d1b0f00fdfabf5c2"],"private":false,"name":"Rebecca Lasseter [Sharpe]","customId":"RebeccaLasseter","links":[]},
  {"_id":"5bfb293dd1b0f00fdfabf5c9","parents":[],"spouses":[],"children":["5bd89b17bc01d746cbe19e47"],"private":false,"name":"John Sharpe","customId":"JohnSharpe","links":[]},
  {"_id":"5bfb7d3dd1b0f00fdfabf5eb","parents":["5bfc2f1fd1b0f00fdfabf5fe","5bfc2f61d1b0f00fdfabf601"],"spouses":["5bce2799548af033b53ada64"],"children":[],"private":true,"name":"EP","customId":"5bfb7d3dd1b0f00fdfabf5eb"},
  {"_id":"5bfc2e6bd1b0f00fdfabf5fa","parents":[],"spouses":["5bfc2e99d1b0f00fdfabf5fb"],"children":["5bfc2b63d1b0f00fdfabf5f4","5bfc2f61d1b0f00fdfabf601"],"private":false,"name":"John E. Sjoquist","customId":"JohnSjoquist","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/150128565280/facts Ancestry"]},
  {"_id":"5bfc2e99d1b0f00fdfabf5fb","parents":[],"spouses":["5bfc2e6bd1b0f00fdfabf5fa"],"children":["5bfc2b63d1b0f00fdfabf5f4","5bfc2f61d1b0f00fdfabf601"],"private":false,"name":"Anna Maria Bystrom [Sjoquist]","customId":"AnnaMariaBystrom","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/150128543508/facts Ancestry"]},
  {"_id":"5bfc2f1fd1b0f00fdfabf5fe","parents":[],"spouses":["5bfc2f61d1b0f00fdfabf601"],"children":["5bfb7d3dd1b0f00fdfabf5eb"],"private":false,"name":"Lawrence Louis Peterson","customId":"LawrenceLouisPeterson","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/28206064968/facts Ancestry"]},
  {"_id":"5bfc2f61d1b0f00fdfabf601","parents":["5bfc2e6bd1b0f00fdfabf5fa","5bfc2e99d1b0f00fdfabf5fb"],"spouses":["5bfc2f1fd1b0f00fdfabf5fe"],"children":["5bfb7d3dd1b0f00fdfabf5eb"],"private":false,"name":"Esther Margarite Sjoquist [Peterson]","customId":"EstherSjoquist","links":["https://www.ancestry.com/family-tree/person/tree/48082533/person/28206064969/facts Ancestry"]},
  {"_id":"5c277fdc941fae0368f62e02","parents":[],"spouses":["5c277fe6941fae0368f62e03"],"children":["5bd8b5a3fabf974800901bdb"],"private":false,"name":"James Elliot Spaulding","customId":"JamesElliotSpaulding","links":[]},
  {"_id":"5c277fe6941fae0368f62e03","parents":[],"spouses":["5c277fdc941fae0368f62e02"],"children":["5bd8b5a3fabf974800901bdb"],"private":false,"name":"Margaret O'Bryan [Spaulding]","customId":"MargaretOBryan","links":[]}
];

module.exports = {
  people: people
};
