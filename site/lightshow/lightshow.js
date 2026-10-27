// The Clive — light show review page.
// The engine comes from the visualizer of the Light Show State Packet (phase 1).
// Song data (titles, cues, sections) and audio are served by the Worker behind the band password;
// nothing song-specific lives in this public file. Comments are stored in D1 through /api/lightshow/comments.
(function () {
  'use strict';

  // ---------- Vocabulary of the LIGHTS track (shared by every song) ----------
  const NAMES = {36:'NOIR',37:'NEON_ALLUMAGE',38:'GYROPHARE_ROUGE',39:'STUDIO_AMBRE',40:'MONTEE_TEAL',41:'REFRAIN_TEAL_AMBRE',42:'ALERTE_ROUGE',43:'POURSUITE_MONTEE',44:'REFRAIN_ALERTE',45:'PONT_ROUGE_FAIBLE',46:'CIEL_EN_FEU',47:'SPHERE',48:'SALON_NOEL',49:'FIN_TRANSMISSION',50:'STROBE_RAFALE',51:'STROBE_FLASH',52:'BUMP',53:'TUBE_G',54:'TUBE_D',55:'CHASE_RAPIDE',56:'STROBE_TUBES',57:'NOIR_COURT',58:'SWAP',59:'GLACE',60:'GIVRE',61:'MONTEE_GEL',62:'LUMIERE',63:'BRASIER',64:'FIGE',65:'AURORE',66:'PROFOND',67:'SOLEIL',68:'RECHERCHE_SIGNAL',69:'DALLE_NOIRE',70:'COURSIVE',71:'STARGATE',72:'ORBITE',73:'ALIGNEMENT',74:'HAL',75:'SOLARISATION',76:'DERIVE',77:'POUSSEE_EPSTEIN',78:'CERES',79:'POSTE_COMBAT',80:'PROTOMOLECULE',81:'TIRS_PDC',82:'ANNEAU',83:'PROTO_SURCHARGE',84:'FLASH_BLANC',85:'ETINCELLE',86:'CHASE_DESCENTE',87:'KICK_DOUX',88:'CIC',89:'OEIL_CYLON',90:'POSTES_ACTION',91:'SAUT_PRL',92:'BARRAGE_FLAK',93:'ECLAT_RAPIDE',94:'FLOTTE',95:'ECHO_G',96:'ECHO_D',97:'OCEAN_VIVANT',98:'SOLEIL_BLEU',99:'SOLEIL_ROUGE',100:'DEUX_SOLEILS',101:'AUTOROUTE',102:'APESANTEUR',103:'NOIR_ET_BLANC',104:'ILE',105:'ACCELERATION',106:'ECLAT_HAUT',107:'ECLAT_MILIEU',108:'ECLAT_BAS',109:'TRAFIC_VERTICAL',110:'DIVA_BLEUE',111:'LAGON_DORE',112:'BOULE_DE_FEU',113:'QUATRE_PIERRES',114:'FAISCEAU_DIVIN',115:'CHUTE_ORANGE_1',116:'CHUTE_ORANGE_2',117:'CHUTE_ORANGE_3',118:'CHUTE_ORANGE_4',119:'CHUTE_ORANGE_5',120:'COUP_ORANGE_G',121:'COUP_ORANGE_D',122:'FANTOMES',123:'SPHERE_NOIRE',124:'BRECHE',125:'MARCHE_ACIER',126:'GUERRE_OR_ACIER',127:'PLAGE_GRISE',0:'ASPIRATION',1:'EXTERMINATION',2:'PIED_G',3:'PIED_D',4:'FRAPPE',5:'CHARLEY',6:'PLUIE_NOCTURNE',7:'PROJECTEURS',8:'NEONS_PLUIE',9:'STORES',10:'PYRAMIDE_TORCHERES',11:'SURVOL',12:'NEONS_PLEINS',13:'LARMES',14:'RAYONS_C',15:'NAVIRES_EN_FEU',16:'ENVOL_BLANC',17:'ORIGAMI',18:'GOUTTE',19:'FEU_G',20:'FEU_D',21:'RAYON',22:'CURSEUR',23:'PLUIE_DE_CODE',24:'COQUE_ACIER',25:'SENTINELLES',26:'FUSILLADE',27:'TEMPS_SUSPENDU',28:'VOIR_LE_CODE',29:'ROUGE_OU_BLEU',30:'DEJA_VU',31:'ALPAGE',32:'PLEIN_AIR',33:'COUCHANT',34:'DISQUE_NOIR',35:'CARRIERE'};
  const DESC = {36:'Tout éteint',37:'Les tubes grésillent puis restent allumés en blanc chaud',38:'Rouge, une bande lumineuse qui tourne comme un gyrophare',39:'Ambre chaud fixe, le studio calme',40:'Teal qui monte en intensité sur 4 mesures',41:'Teal et ambre, pleine intensité',42:'Rouge plein',43:'Remplissage du bas vers le haut à chaque temps',44:'Rouge et orange, pulsé sur les temps',45:'Rouge faible fixe',46:'Dégradé violet vers orange, le ciel en feu',47:'Cyan, ambre, lilas, violet qui défilent',48:'Ambre doux qui scintille, le salon de Noël',49:'Les tubes s’éteignent en grésillant',50:'Strobe de la grosse caisse en rafale, tant que la note dure',51:'Un gros flash du strobe de la grosse caisse',52:'Flash blanc chaud des deux monolithes',53:'Accent sur le monolithe gauche',54:'Accent sur le monolithe droit',55:'Poursuite rapide de pixels, tant que la note dure',56:'Strobe sur les tubes, tant que la note dure',57:'Tubes éteints, tant que la note dure',58:'Inverse les couleurs gauche et droite',59:'Bleu glacé fixe, plus blanc vers le bas',60:'Bleu nuit avec des scintillements de givre',61:'Remplissage lent du bas vers le haut, bleu puis blanc, sur 8 mesures',62:'Ambre et blanc chaud, pulsé sur les temps',63:'Rouge et ambre, croisés gauche-droite, pulsé',64:'Tout figé : noir, un filet blanc au milieu des tubes',65:'Teal et violet qui ondulent lentement',66:'Violet profond qui respire',67:'Blanc chaud plein',68:'On cherche le signal : grésillement, une bande qui balaie au hasard, coupures et accroches brèves',69:'Dalle noire mate, arêtes blanc froid en haut et en bas, un reflet lent qui remonte',70:'Coursive de vaisseau : blanc froid clinique en panneaux, qui respire à peine',71:'La porte des étoiles : traînées saturées magenta, orange, cyan et vert acide qui filent à toute vitesse',72:'En orbite : bleu Terre profond, un liseré blanc qui glisse lentement en haut des tubes',73:'Alignement des astres : un soleil blanc se lève du bas des tubes sur 4 mesures, jusqu’au plein feu',74:'L’œil rouge de HAL au milieu des tubes, sur fond noir, qui pulse sur les temps',75:'Solarisation : à pleine intensité, aplats saturés qui changent de couleur à chaque temps, haut et bas opposés',76:'Dérive en apesanteur : noir spatial, quelques étoiles froides qui glissent lentement, vers le bas à gauche, vers le haut à droite',77:'Poussée Epstein : un panache de plasma bleu-blanc part du bas des tubes et vibre, halo violet au-dessus',78:'Cérès : lumière sodium ambre, sale et industrielle, en panneaux, avec des néons qui sautent',79:'Poste de combat : rouge tamisé du vaisseau en alerte, une ligne rouge qui balaie du haut vers le bas toutes les 2 temps',80:'La protomolécule : bleu électrique bioluminescent, des filaments qui tournent (ça monte à gauche, ça descend à droite) et des étincelles',81:'Tirs de PDC : noir, des rafales de traçantes blanc-orange qui filent vers le haut',82:'L’Anneau : noir, une bande irisée teal-bleu-violet qui flotte lentement, poussières',83:'Protomolécule en surcharge : bleu, cyan, violet et blanc à pleine intensité, rotation rapide, pluie d’étincelles',84:'Flash blanc froid très court sur les deux tubes',85:'Petit éclat discret à une hauteur au hasard, pour suivre des notes rapides',86:'Une bande blanche qui descend du haut vers le bas des tubes, sur la durée de la note',87:'Flash doux du strobe de la grosse caisse',88:'Centre de commandement : tungstène ambre tamisé, plus clair en haut, écrans vert-bleu froids, grain documentaire',89:'Œil cylon : noir, un œil rouge qui balaie de haut en bas et retour, avec une traînée',90:'Postes d’action : rouge d’alerte, les moitiés haute et basse des tubes s’allument en alternance à chaque temps',91:'Saut PRL : les moteurs chargent, un remplissage bleu-blanc monte du bas sur 2 mesures en vibrant de plus en plus vite',92:'Barrage de flak : orange et ambre à pleine intensité, des éclats blanc-orange qui éclosent à chaque demi-temps',93:'Éclat blanc très court sur quelques pixels, à une hauteur au hasard, pour suivre des synthés rapides',94:'La flotte dans le vide : bleu nuit presque noir, des petites lumières de vaisseaux qui scintillent lentement',95:'Écho sur le monolithe gauche : accent doux et plus froid, pour les répétitions d’une note',96:'Écho sur le monolithe droit : accent doux et plus froid, pour les répétitions d’une note',97:'L’océan vivant : vert-gris, ocre et écume qui ondulent lentement, comme un liquide qui pense',98:'Station sous le soleil bleu : bleu froid un peu blanchi vers le bas, fixe, respire à peine',99:'Station sous le soleil rouge : rouge profond un peu ambré vers le haut, fixe, respire à peine',100:'Deux soleils intriqués : bleu à gauche, rouge à droite, ils pulsent ensemble sur les temps, un filet blanc à la même hauteur des deux côtés',101:'Autoroute : des lampes blanc chaud qui défilent vers le bas sur le noir, une par temps, hypnotique',102:'Apesanteur : ambre de bougie qui vacille, des points chauds qui montent lentement',103:'Noir et blanc : gris pellicule désaturé, grain qui scintille',104:'L’île : océan sombre, un point chaud au milieu qui se resserre lentement',105:'Accélération : l’autoroute qui monte en puissance sur 7 mesures, 1 puis 2 puis 4 lampes par temps, de plus en plus fort et blanc',106:'Flash blanc très court sur le tiers haut des tubes (3 notes descendantes : haut, milieu, bas)',107:'Flash blanc très court sur le tiers du milieu des tubes',108:'Flash blanc très court sur le tiers bas des tubes',109:'Ville verticale : brume bleu-gris, des phares blancs qui descendent à gauche, des feux rouges qui montent à droite, en continu',110:'Diva bleue : bleu profond, une lueur cyan-blanc au milieu des tubes, le tout pulse sur les contretemps (les « et »)',111:'Lagon doré : turquoise en bas, or en haut, des reflets qui ondulent lentement',112:'Boule de feu : noir, des fissures de magma rouge-orange qui pulsent lentement et grandissent sur 7 mesures',113:'Quatre pierres : pénombre de temple, quatre pierres (terre, air, eau, feu) qui s’ouvrent une par une, une toutes les 2 mesures',114:'Faisceau divin : colonne or et blanc à pleine intensité, bords orange, pulse sur les contretemps',115:'Flash orange très court tout en haut des tubes (figure de percussion en 5 coups qui tombe : 1 à 5)',116:'Flash orange très court aux trois quarts de la hauteur',117:'Flash orange très court au milieu des tubes',118:'Flash orange très court au quart de la hauteur',119:'Flash orange très court tout en bas des tubes',120:'Coup orange sur tout le monolithe gauche, très court (contretemps)',121:'Coup orange sur tout le monolithe droit, très court (contretemps)',122:'Fantômes : pénombre gris-bleu, des silhouettes argentées qui apparaissent et s’effacent lentement en tremblant, à gauche puis à droite',123:'Sphère noire : panneaux de labo blanc froid en haut et en bas, un trou noir au milieu qui avale la lumière, liseré cyan-violet qui respire',124:'Brèche : noir, une fente blanc-or au milieu des tubes qui s’ouvre et vibre de plus en plus sur 4 mesures, halo bleu froid',125:'Marche d’acier : gris acier, un pas lourd à chaque temps, qui descend d’un quart de tube par temps (haut, puis vers le bas)',126:'Or contre acier : bronze-or à gauche, acier à droite, ils tirent à tour de rôle (gauche sur 1 et 3, droite sur 2 et 4), un œil bleu en haut à gauche',127:'Plage grise : ciel gris-bleu, mer qui ondule en bas, une silhouette bleue au milieu qui grésille et s’efface sur 6 mesures',0:'Aspiration : tout est aspiré vers le haut, traînées acier et or de plus en plus rapides, lumière blanche au sommet des tubes',1:'Extermination : flash négatif bleu-blanc en deux éclairs très courts sur les deux monolithes',2:'Coup de grosse caisse à gauche : la lumière jaillit du bas du monolithe gauche et retombe',3:'Coup de grosse caisse à droite : la lumière jaillit du bas du monolithe droit et retombe',4:'Coup de caisse claire : un trait blanc qui tombe du haut vers le bas des tubes, très vite, sur les deux monolithes',5:'Charleston : une petite étincelle froide tout en haut d’un tube, à gauche ou à droite',6:'Pluie nocturne : bleu nuit presque noir, des traînées de pluie qui tombent, un feu ambre lointain qui traverse lentement ; s’éclaire doucement sur 8 mesures',7:'Projecteurs : brume bleu-gris, deux faisceaux blancs qui balaient lentement de haut en bas dans la pluie ; s’éclaire sur 6 mesures',8:'Néons sous la pluie : rose et cyan en panneaux (opposés gauche-droite), qui grésillent parfois, pluie par-dessus ; monte lentement sur 16 mesures',9:'Stores : lamelles de lumière sodium qui glissent lentement vers le bas dans la fumée, une lueur de phare qui passe',10:'Pyramide et torchères : ambre sodium en bas, noir en haut, des jets de flamme qui montent au sommet des tubes de temps en temps',11:'Survol de la ville : nuit bleue, des lumières sodium et blanches qui défilent vers le bas, de plus en plus vives sur 14 mesures',12:'Néons pleins : rose, violet et cyan saturés, pulsé sur les temps, pluie blanche par-dessus',13:'Larmes : les néons s’éteignent en 1,5 mesure, puis le noir et quelques traînées froides qui tombent très lentement',14:'Rayons C : noir bleuté pulsé sur les temps, des rayons cyan-blanc qui scintillent et changent de hauteur toutes les 2 temps',15:'Navires en feu : ciel violet étoilé, une boule de feu au milieu des tubes qui éclate sur chaque temps, de plus en plus forte sur 12 mesures',16:'Envol blanc : une lumière blanche monte du bas vers le haut des tubes sur 1,5 mesure et s’éteint',17:'Origami : pluie sombre, un reflet argenté qui scintille au milieu des tubes, le tout s’éteint lentement sur 10 mesures',18:'Goutte : une goutte froide qui tombe le long d’un tube (gauche ou droite au hasard), pour des notes isolées',19:'Feu à gauche : une flamme orange jaillit du bas du monolithe gauche',20:'Feu à droite : une flamme orange jaillit du bas du monolithe droit',21:'Rayon : un trait cyan-blanc très court à une hauteur au hasard, sur les deux monolithes',22:'Curseur : noir, un bloc vert phosphore clignote tout en haut des tubes, allumé sur la première moitié de chaque temps',23:'Pluie de code : des colonnes de signes verts tombent le long des tubes, tête blanc-vert, traîne qui scintille ; plus dense et plus vive sur 8 mesures',24:'Coque d’acier : le vrai monde, pénombre bleu acier en panneaux qui respirent, une lampe ambre qui vacille tout en bas',25:'Sentinelles : noir, des yeux rouges qui fouillent les tubes en tous sens, un de plus toutes les 2 temps (jusqu’à 6)',26:'Fusillade : vert saturé pulsé sur les temps, des éclats blancs (douilles, gravats) à une hauteur au hasard sur chaque croche, pluie de code dessous',27:'Temps suspendu : vert presque noir, des ondes blanc-vert qui s’écartent très lentement du milieu des tubes, une balle blanche qui monte à gauche et descend à droite sur 6 temps',28:'Voir le code : pluie de code dense et rapide à pleine intensité, fond vert pulsé sur les temps',29:'Rouge ou bleu : pénombre d’orage, une lueur bleue au milieu du monolithe gauche, rouge au milieu du droit, qui respirent ; un éclair blanc de temps en temps',30:'Déjà-vu : la scène s’assombrit et une bande vert-blanc balaie les tubes de haut en bas, deux fois de suite à l’identique',31:'Alpage en plein jour : herbe verte en bas, ciel bleu qui pâlit vers l’horizon, petits nuages blancs qui montent lentement ; s’éclaire sur 4 mesures',32:'Plein air : ciel bleu pulsé sur les temps, une bande veste rouge sur un monolithe et gilet orange sur l’autre (elles changent de côté à chaque mesure), bandeau jaune en haut sur le 1',33:'Couchant : dégradé orange-or en bas vers violet puis indigo en haut, un soleil doré qui descend sur 16 mesures pendant que le ciel s’assombrit, pulsé sur les temps',34:'Disque noir : noir, un anneau blanc chaud très fin au milieu des tubes (plus fort à gauche qu’à droite), son reflet ambre courbé au-dessus et au-dessous, qui ondule ; un tic blanc froid en haut des tubes tous les 2 temps ; grandit sur 4 mesures',35:'Carrière de nuit : le projecteur blanc froid s’allume en haut, puis les ampoules ambre au sol une par une (2 mesures) ; lueur orange des amplis au-dessus, roche chaude à peine éclairée'};
  const C = {amber:[1,.62,.18],teal:[.15,.85,.78],red:[1,.08,.05],orange:[1,.38,.05],violet:[.55,.15,1],cyan:[.1,.85,1],lilac:[.8,.58,1],warm:[1,.8,.55],white:[1,1,1],ice:[.35,.72,1],deep:[.06,.18,.55],screen:[.18,.42,1],magenta:[1,.12,.7],space:[.82,.9,1],lime:[.7,1,.1],earth:[.03,.12,.5],plasma:[.5,.6,1],sodium:[1,.47,.1],proto:[.06,.4,1],ocean:[.06,.32,.28],ochre:[.78,.6,.28],foam:[.75,.86,.8],sunblue:[.32,.55,1],sunred:[1,.16,.05],leeloo:[1,.4,.02],haze:[.1,.14,.22],tail:[1,.04,.06],diva:[.12,.3,1],divaglow:[.55,.85,1],lagoon:[0,.75,.7],gold:[1,.72,.22],magma:[1,.25,.02],stone:[.08,.05,.02],ghost:[.72,.8,.92],steel:[.55,.64,.78],bronze:[.9,.55,.16],dalek:[.1,.45,1],breach:[1,.9,.68],sea:[.22,.3,.36],holo:[.25,.5,1],xray:[.55,.85,1],neonpink:[1,.08,.5],rain:[.42,.55,.75],night:[.03,.05,.11],skyTop:[.08,.36,.88],skyLow:[.48,.76,1],grass:[.22,.5,.06],hivis:[1,.33,.02],jacket:[.92,.05,.08],tag:[1,.76,.16],dusk:[.1,.06,.32],mauve:[.55,.16,.42],sunset:[.95,.28,.03],disk:[1,.88,.66],bulb:[1,.52,.1],amp:[1,.3,.03],spot:[.86,.93,1],rock:[.6,.47,.34],code:[.1,1,.22],codeHead:[.78,1,.8],codeDark:[0,.3,.06],pillRed:[1,.05,.03],pillBlue:[.08,.3,1]};
  const SWATCH = {36:'#000',37:C.warm,38:C.red,39:C.amber,40:C.teal,41:'linear-gradient(#e89c2e,#26d9c7)',42:C.red,43:'linear-gradient(#ff600d,#3a0a06)',44:'linear-gradient(#ff600d,#ff140c)',45:'#4a0d0a',46:'linear-gradient(#ff600d,#8c26ff)',47:'linear-gradient(#1ad9ff,#ff9e2e,#cc94ff,#8c26ff)',48:'#a8691f',49:'linear-gradient(#ffcc8c,#000)',50:'repeating-linear-gradient(#fff 0 4px,#000 4px 8px)',51:'#fff',52:'#ffe7c4',53:'linear-gradient(90deg,#ffe7c4 50%,#222 50%)',54:'linear-gradient(90deg,#222 50%,#ffe7c4 50%)',55:'repeating-linear-gradient(#ffcc8c 0 3px,#3a2a10 3px 7px)',56:'repeating-linear-gradient(#fff 0 3px,#222 3px 6px)',57:'#111',58:'linear-gradient(90deg,#26d9c7 50%,#e89c2e 50%)',59:'linear-gradient(#5bb8ff,#cfe9ff)',60:'#0f2e8c',61:'linear-gradient(#fff,#5bb8ff 60%,#0a1530)',62:'linear-gradient(#ffcc8c,#ff9e2e)',63:'linear-gradient(#ff140c,#ff9e2e)',64:'linear-gradient(#000 45%,#fff 45% 55%,#000 55%)',65:'linear-gradient(#26d9c7,#8c26ff)',66:'#2a0d4a',67:'#ffcc8c',68:'repeating-linear-gradient(#9fe8ff 0 2px,#0a1530 2px 5px,#4a6a80 5px 6px,#000 6px 9px)',69:'linear-gradient(#cfe0ff 0 6%,#08090c 6% 94%,#cfe0ff 94%)',70:'repeating-linear-gradient(#d1e6ff 0 6px,#1a1d22 6px 8px)',71:'linear-gradient(#ff1fb3,#ff600d,#1ad9ff,#b3ff1a)',72:'linear-gradient(#e6f0ff 0 12%,#08207f 12%,#03113f)',73:'linear-gradient(#000,#ffe7c4 70%,#fff)',74:'radial-gradient(circle,#ff0a05 0 30%,#000 60%)',75:'linear-gradient(#ff1fb3 50%,#b3ff1a 50%)',76:'radial-gradient(circle at 30% 30%,#d1e6ff 0 4%,transparent 6%),radial-gradient(circle at 70% 75%,#5bb8ff 0 4%,transparent 6%),#020308',77:'linear-gradient(#2a1f66,#8099ff 50%,#fff)',78:'repeating-linear-gradient(#a8500f 0 6px,#3a1a05 6px 8px)',79:'linear-gradient(#240302,#ff140c 50%,#240302)',80:'linear-gradient(#0f66ff,#1ad9ff,#0f66ff)',81:'repeating-linear-gradient(#ffe0b0 0 2px,#140400 2px 9px)',82:'linear-gradient(#020308 30%,#26d9c7 42%,#8c26ff 58%,#020308 70%)',83:'linear-gradient(#fff,#1ad9ff,#8c26ff,#0f66ff)',84:'#f2f7ff',85:'radial-gradient(circle,#cfe9ff 0 25%,#111 45%)',86:'repeating-linear-gradient(180deg,#ffcc8c 0 3px,#3a2a10 3px 7px)',87:'#8a8a8a',88:'repeating-linear-gradient(#5a3a12 0 6px,#1d4a4a 6px 8px)',89:'linear-gradient(#050000 40%,#ff140c 50%,#050000 60%)',90:'linear-gradient(#ff2a0c 50%,#2a0302 50%)',91:'linear-gradient(#08101a,#5bb8ff 60%,#fff)',92:'radial-gradient(circle,#fff 0 15%,#ff8a1a 35%,#ff600d)',93:'radial-gradient(circle,#fff 0 30%,#111 50%)',94:'radial-gradient(circle at 35% 30%,#ffcc8c 0 4%,transparent 6%),radial-gradient(circle at 65% 70%,#d1e6ff 0 4%,transparent 6%),#03081a',95:'linear-gradient(90deg,#a89c8a 50%,#222 50%)',96:'linear-gradient(90deg,#222 50%,#a89c8a 50%)',97:'linear-gradient(#0f5247,#c79a47 45%,#bfdccc 60%,#0f5247)',98:'linear-gradient(#528cff,#a9c4ff)',99:'linear-gradient(#ff7a2e,#ff290d)',100:'linear-gradient(90deg,#528cff 48%,#fff 48% 52%,#ff290d 52%)',101:'repeating-linear-gradient(#ffd9a8 0 3px,#050505 3px 12px)',102:'radial-gradient(circle at 40% 30%,#ffd9a8 0 5%,transparent 8%),#3a2208',103:'repeating-linear-gradient(#6b6b6b 0 2px,#4a4a4a 2px 4px)',104:'radial-gradient(circle,#ffcc8c 0 18%,#06221d 40%)',105:'repeating-linear-gradient(#fff 0 2px,#050505 2px 5px,#ffd9a8 5px 7px,#050505 7px 14px)',106:'linear-gradient(#fff 33%,#111 33%)',107:'linear-gradient(#111 33%,#fff 33% 66%,#111 66%)',108:'linear-gradient(#111 66%,#fff 66%)',109:'repeating-linear-gradient(#e6ecff 0 2px,#1e2a3d 2px 9px)',110:'linear-gradient(#2659ff,#8cd9ff 50%,#2659ff)',111:'linear-gradient(#ffbf40,#00bfb3)',112:'linear-gradient(#050000 30%,#ff400a 45%,#050000 60%)',113:'linear-gradient(#ff3314 0 20%,#140d05 20% 30%,#4d8cff 30% 50%,#140d05 50% 55%,#d9e6ff 55% 75%,#140d05 75% 80%,#c79a47 80%)',114:'linear-gradient(90deg,#ff6605,#fff 35% 65%,#ff6605)',115:'linear-gradient(#ff6605 20%,#111 20%)',116:'linear-gradient(#111 20%,#ff6605 20% 40%,#111 40%)',117:'linear-gradient(#111 40%,#ff6605 40% 60%,#111 60%)',118:'linear-gradient(#111 60%,#ff6605 60% 80%,#111 80%)',119:'linear-gradient(#111 80%,#ff6605 80%)',120:'linear-gradient(90deg,#ff6605 50%,#222 50%)',121:'linear-gradient(90deg,#222 50%,#ff6605 50%)',122:'radial-gradient(ellipse 30% 45% at 50% 50%,#b8cceb,#0a0d12 80%)',123:'linear-gradient(#d9e6ff 0 22%,#3a1f66 26%,#000 32% 68%,#1a8cb3 74%,#d9e6ff 78%)',124:'linear-gradient(#000 40%,#4d8cff 46%,#ffe6ad 50%,#4d8cff 54%,#000 60%)',125:'repeating-linear-gradient(#c7d4e6 0 25%,#2e3640 25% 50%)',126:'linear-gradient(90deg,#e68c29 50%,#8ca3c7 50%)',127:'linear-gradient(#7a8a99,#4066cc 50%,#38505c)',0:'linear-gradient(#fff,#8ca3c7 40%,#e6b04d 70%,#1a1d22)',1:'#8cd9ff',2:'linear-gradient(90deg,#e6f0ff 50%,#222 50%)',3:'linear-gradient(90deg,#222 50%,#e6f0ff 50%)',4:'linear-gradient(#fff,#222)',5:'linear-gradient(#cfe9ff 12%,#111 12%)',6:'repeating-linear-gradient(170deg,#6b8cbf 0 2px,#05080f 2px 10px)',7:'linear-gradient(#141d2a 30%,#cfe3ff 45%,#141d2a 60%)',8:'linear-gradient(#ff1480,#1ad9ff)',9:'repeating-linear-gradient(#80420d 0 4px,#0d0702 4px 8px)',10:'linear-gradient(#08090f 30%,#ff8a1a 34%,#08090f 40% 55%,#c76a14 60%,#ff9e2e)',11:'repeating-linear-gradient(#ff7a1a 0 2px,#050c26 2px 7px,#e6f0ff 7px 9px,#050c26 9px 14px)',12:'linear-gradient(#ff1480,#8c26ff,#1ad9ff)',13:'repeating-linear-gradient(170deg,#3a5a80 0 1px,#05080f 1px 14px)',14:'linear-gradient(#050c26 20%,#cff6ff 25%,#050c26 32% 60%,#cff6ff 65%,#050c26 70%)',15:'radial-gradient(circle,#ffd18c 0 15%,#ff400a 35%,#170828 65%)',16:'linear-gradient(#fff,#000)',17:'radial-gradient(circle,#d1e6ff 0 10%,#08101f 35%)',18:'linear-gradient(#111 30%,#cfe9ff 45%,#111 50%)',19:'linear-gradient(90deg,#ff7a1a 50%,#222 50%)',20:'linear-gradient(90deg,#222 50%,#ff7a1a 50%)',21:'linear-gradient(#111 45%,#b8f2ff 50%,#111 55%)',22:'linear-gradient(#1aff38 0 14%,#000 14%)',23:'repeating-linear-gradient(90deg,#000 0 3px,#0d4d12 3px 5px,#1aff38 5px 6px,#000 6px 10px)',24:'repeating-linear-gradient(#24324a 0 6px,#0b0e14 6px 8px)',25:'radial-gradient(circle at 35% 30%,#ff1408 0 5%,transparent 8%),radial-gradient(circle at 65% 65%,#ff1408 0 5%,transparent 8%),#030303',26:'radial-gradient(circle,#fff 0 12%,#1aff38 30%,#0a4d12)',27:'repeating-radial-gradient(circle,#0a1a0c 0 6px,#8cffa0 7px,#0a1a0c 9px)',28:'linear-gradient(#c7ffcc,#1aff38 40%,#0d8020)',29:'linear-gradient(90deg,#144dff 50%,#ff0d08 50%)',30:'linear-gradient(#0a1a0c 40%,#c7ffcc 50%,#0a1a0c 60%)',31:'linear-gradient(#1f6bd9,#73b8f2 80%,#408014 80%)',32:'linear-gradient(#ffc733 15%,#3a8ff0 15%,#3a8ff0 45%,#ff5a08 45%,#e6101a 70%,#3a8ff0 70%)',33:'linear-gradient(#1f1452,#8c2e73,#ff9e1f,#e64008)',34:'linear-gradient(#000 30%,#ff8c26 38%,#000 44%,#fff0cc 50%,#000 56%,#ff8c26 62%,#000 70%)',35:'linear-gradient(#e6f0ff 6%,#000 6%,#4d3a2a 30%,#ff520a 60%,#ff8c1f 75%,#000 100%)'};
  const STATES = new Set([36,37,38,39,40,41,42,43,44,45,46,47,48,49,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,88,89,90,91,92,94,97,98,99,100,101,102,103,104,105,109,110,111,112,113,114,122,123,124,125,126,127,0,6,7,8,9,10,11,12,13,14,15,16,17,22,23,24,25,26,27,28,29,31,32,33,34,35]);
  const MATRIX = new Set([22, 23, 24, 25, 26, 27, 28, 29]);
  // Kit hits (2-5) and accents (52-54) take the colours of these looks: the reels by day (31-33), the bulbs at night (34-35)
  const DAY = {kick: [1, .33, .02], snare: [1, .76, .16], hat: [1, .95, .75], acc: [1, .85, .45]};
  const NIGHT = {kick: [1, .52, .1], snare: [1, .88, .66], hat: [1, .75, .45], acc: [1, .62, .2]};
  const TINT = {31: DAY, 32: DAY, 33: DAY, 34: NIGHT, 35: NIGHT};
  const HOT = new Set([50, 51, 56]);
  const N = 32;

  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);
  const API = '/api/lightshow/';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };
  let token = store.get('ls_token');

  async function api(path, opts = {}) {
    const headers = Object.assign({}, opts.headers || {});
    if (token) headers.Authorization = 'Bearer ' + token;
    if (opts.body && typeof opts.body !== 'string') { headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(opts.body); }
    const r = await fetch(API + path, Object.assign({}, opts, { headers }));
    if (r.status === 401 && path !== 'login') { logout(); throw new Error('auth'); }
    return r;
  }
  async function apiJson(path, opts) {
    const r = await api(path, opts);
    let d = null; try { d = await r.json(); } catch (e) {}
    if (!r.ok || !d || d.ok === false) throw new Error((d && d.error) || 'Erreur ' + r.status);
    return d;
  }

  const rgb = (a) => Array.isArray(a) ? `rgb(${a.map((v) => Math.round(v * 255)).join(',')})` : a;
  const fmt = (t) => { t = Math.max(0, t); const m = Math.floor(t / 60), s = t - m * 60; return String(m).padStart(2, '0') + ':' + s.toFixed(2).padStart(5, '0'); };
  const fmtShort = (t) => { t = Math.max(0, t); const m = Math.floor(t / 60), s = t - m * 60; return m + ':' + s.toFixed(1).padStart(4, '0'); };
  const fmtDate = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }); };

  // ---------- Song state ----------
  // A song without a light plan yet (no bpm, no cues) can still be played and commented: comments are then ideas.
  // A song can change tempo: tm = [[beat, bpm], ...] with beats counted from the downbeat (off). Without tm, bpm holds.
  let SONGS = [], song = null, EV = [], SEC = [], BPM = 0, SPB = 0, OFF = 0, DUR = 1, TM = [];
  const hasPlan = () => EV.length > 0;
  function setTempo(s) {
    const tm = s.tm && s.tm.length ? s.tm : (s.bpm ? [[0, s.bpm]] : []); let t = OFF;
    TM = tm.map(([b, bpm], i) => { if (i) t += (b - tm[i - 1][0]) * 60 / tm[i - 1][1]; return [b, bpm, t]; });
  }
  const segT = (t) => { let g = TM[0]; for (const x of TM) { if (x[2] <= t) g = x; else break; } return g; };
  const segB = (b) => { let g = TM[0]; for (const x of TM) { if (x[0] <= b) g = x; else break; } return g; };
  const beatAt = (t) => { if (!TM.length) return 0; const g = segT(t); return g[0] + (t - g[2]) * g[1] / 60; };
  const timeAt = (b) => { if (!TM.length) return 0; const g = segB(b); return g[2] + (b - g[0]) * 60 / g[1]; };
  const barOf = (t) => { if (!SPB) return '—'; const b = Math.max(0, beatAt(t)); return (Math.floor(b / 4) + 1) + '.' + (Math.floor(b % 4) + 1); };
  const secOf = (t) => { let s = null; for (const x of SEC) { if (x[0] <= t + 1e-6) s = x; else break; } return s ? s[1] : ''; };
  const stateOf = (t) => hasPlan() ? NAMES[frame(beatAt(t)).st] : '';
  const where = (t) => [secOf(t), stateOf(t)].filter(Boolean).join(' · ');
  const stepNav = () => SPB ? SPB * 4 : 5;
  const stepFine = () => SPB || .5;

  // ---------- Engine ----------
  function frame(beat) {
    let st = 36, stB = 0, swap = 0; const held = [], imp = [];
    for (const [b, n, l] of EV) {
      if (b > beat) break;
      if (STATES.has(n)) { st = n; stB = b; }
      else if (n === 58) swap ^= 1;
      else if (n === 50 || n === 55 || n === 56 || n === 57 || n === 86) { if (beat < b + l) held.push([n, b, l]); }
      else imp.push([n, b]);
    }
    return { st, stB, swap, held, imp };
  }
  const hash = (x) => { const s = Math.sin(x * 12.9898) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  const mul = (a, k) => a.map((v) => v * k);
  // Rain on the tubes: two streaks per side falling at different speeds, bright head with a tail above it
  const rainK = (y, side, age, v) => {
    let k = 0;
    for (let j = 0; j < 2; j++) { const f = ((y * 1.3 + age * v * (1 + .4 * j) + hash(side * 5 + j * 11)) % 1 + 1) % 1; if (f < .14) k = Math.max(k, 1 - f / .14); }
    return k;
  };
  // Code rain: n green streams per side falling at speed v, white-green head, a trail above it whose signs flicker
  const codeRain = (y, i, side, age, n, v, lv) => {
    let c = mul(C.codeDark, .18 * lv);
    for (let j = 0; j < n; j++) {
      const sp = v * (.7 + .6 * hash(j * 7.1 + side * 3.3)), u = ((y + age * sp + hash(j * 2.9 + side * 5.7) * 1.4) % 1.4 + 1.4) % 1.4;
      if (u > .5) continue;
      const g = .5 + .5 * hash(Math.floor(age * 10) + i * 3.7 + side * 9 + j), k = u < .05 ? 1 : Math.exp(-(u - .05) / .14) * g;
      c = mix(c, mix(C.code, C.codeHead, u < .05 ? 1 - u / .05 : 0), Math.min(1, k * lv));
    }
    return c;
  };
  function base(st, i, side, age, beat) {
    const y = i / (N - 1), fb = beat - Math.floor(beat);
    switch (st) {
      case 36: return [0, 0, 0];
      case 37: { if (age < 1.4) { const on = hash(Math.floor(age * 14) + side * 7) > .45; return on ? mul(C.warm, .7) : [0, 0, 0]; } return mul(C.warm, .5 + .04 * Math.sin(age * 50)); }
      case 38: { const k = Math.pow(Math.max(0, Math.cos(2 * Math.PI * (beat / 2 - y))), 4); return mul(C.red, .12 + .88 * k); }
      case 39: return mul(C.amber, .55 + .2 * y);
      case 40: return mul(C.teal, Math.min(1, .15 + age / 10.3));
      case 41: return mix(C.teal, C.amber, side ? 1 - y : y);
      case 42: return C.red;
      case 43: return y <= fb ? mix(C.red, C.orange, y) : mul(C.red, .15);
      case 44: return mul(mix(C.red, C.orange, side ? 1 - y : y), .72 + .28 * (1 - fb));
      case 45: return mul(C.red, .22);
      case 46: { const k = Math.min(1, Math.max(0, y + .25 * Math.sin(age * .8 + side * Math.PI))); return mix(C.violet, C.orange, k); }
      case 47: { const pal = [C.cyan, C.amber, C.lilac, C.violet]; const p = ((y * 2 + beat / 4 + side * .5) % 1 + 1) % 1 * 4; const a = Math.floor(p), k = p - a; return mix(pal[a % 4], pal[(a + 1) % 4], k); }
      case 48: return mul(C.amber, .32 + .25 * hash(i * 3.1 + side * 17 + Math.floor(age * 3)));
      case 49: { const k = Math.max(0, 1 - age / 2.6); const on = hash(Math.floor(age * 16) + side) > (1 - k) * .9; return on ? mul(C.warm, .5 * k) : [0, 0, 0]; }
      case 59: return mul(mix(C.ice, C.white, (1 - y) * .45), .42 + .18 * (1 - y));
      case 60: return hash(i * 7.3 + side * 13 + Math.floor(age * 6)) > .9 ? mul(C.white, .75) : mul(C.deep, .55);
      case 61: { const lv = Math.min(1, age / (32 * SPB)); return y <= lv ? mix(C.ice, C.white, y) : mul(C.deep, .15); }
      case 62: return mul(mix(C.amber, C.warm, y), .72 + .28 * (1 - fb));
      case 63: return mul(mix(C.red, C.amber, side ? 1 - y : y), .7 + .3 * (1 - fb));
      case 64: return Math.abs(y - .5) < .045 ? mul(C.white, .7) : [0, 0, 0];
      case 65: { const k = .5 + .5 * Math.sin(y * 6 + age * 1.5 + side * Math.PI); return mul(mix(C.teal, C.violet, k), .6); }
      case 66: return mul(C.violet, .16 + .07 * Math.sin(age * 2));
      case 67: return C.warm;
      case 68: {
        const q = Math.floor(age * 18); if (hash(q * 1.7 + side * 3.3) > .78) return [0, 0, 0];
        const pos = .5 + .47 * Math.sin(age * 2.3 + side * 1.9) * Math.sin(age * .71 + hash(Math.floor(age * 2) + side) * 3);
        const d = Math.abs(y - pos); const lock = hash(Math.floor(age * 1.3) + side * 5) > .86;
        const g = d < .07 ? (1 - d / .07) * (lock ? 1 : .7) : 0; const n = hash(i * 5.1 + q * .37 + side * 11) > .9 ? .35 : 0;
        return mix(mul(C.ice, .05 + n), lock ? C.white : C.teal, g);
      }
      case 69: {
        if (i === 0 || i === N - 1) return mul(C.ice, .55);
        const p = (age * .1 + side * .5) % 1.4 - .2, d = (y - p) / .09;
        return mix([.015, .018, .028], C.ice, .18 * Math.exp(-d * d));
      }
      case 70: {
        if (i % 4 === 3) return [0, 0, 0];
        return mul(C.space, .4 + .06 * Math.sin(age * 1.2 + side));
      }
      case 71: {
        const pal = [C.magenta, C.orange, C.cyan, C.lime, C.violet];
        const p = y * 3 + beat * 1.5 + side * .37, f = p - Math.floor(p), k = ((Math.floor(p) % 5) + 5) % 5;
        return mul(pal[k], .25 + .75 * f * f);
      }
      case 72: {
        const rim = .86 + .08 * Math.sin(age * .5 + side * Math.PI), d = (y - rim) / .035;
        return mix(mul(C.earth, .35 + .5 * (1 - y)), C.space, Math.exp(-d * d));
      }
      case 73: {
        const sun = Math.min(1, age / (16 * SPB)) * 1.1 - .1, d = y - sun;
        if (d < 0) return mix(C.warm, C.white, Math.min(1, -d * 4));
        return mul(C.warm, Math.exp(-d / .06));
      }
      case 74: {
        const d = (y - .5) / .13; const k = Math.exp(-d * d);
        return mul(C.red, k * (.55 + .45 * (1 - fb)));
      }
      case 75: {
        const pal = [C.magenta, C.lime, C.orange, C.cyan], k = Math.floor(beat) + (y > .5 ? 2 : 0) + side;
        return pal[((k % 4) + 4) % 4];
      }
      case 76: {
        const q = y * N + (side ? -1 : 1) * age * 1.1, c = Math.floor(q), h = hash(c * 3.7 + side * 19);
        const sky = mul(C.earth, .06 * (1 - y));
        if (h < .87) return sky;
        return mix(sky, mix(C.space, C.ice, hash(c * 1.3)), (.35 + .3 * Math.sin(age * 3 + c)) * (1 - Math.abs(q - c - .5)));
      }
      case 77: {
        const L = .55 + .08 * Math.sin(age * 9 + side) + .06 * hash(Math.floor(age * 20) + side * 3);
        if (y < L) { const k = 1 - y / L; return mul(mix(C.plasma, C.white, k * k), .35 + .65 * k); }
        return mul(C.violet, .35 * Math.exp(-(y - L) / .08));
      }
      case 78: {
        const p = Math.floor(i / 8); if (i % 8 === 7) return [0, 0, 0];
        const out = hash(Math.floor(age * 7) + p * 3 + side * 5) > .94;
        return mul(C.sodium, out ? .04 : (.2 + .12 * hash(p + side * 5)) * (1.15 - .3 * y));
      }
      case 79: {
        const pos = 1 - ((beat / 2) % 1 + 1) % 1, d = (y - pos) / .06;
        return mul(C.red, .13 + .7 * Math.exp(-d * d));
      }
      case 80: {
        const fil = .5 + .5 * Math.sin(2 * Math.PI * (y * 2 - (side ? -1 : 1) * beat / 2));
        if (hash(i * 5.3 + side * 11 + Math.floor(age * 10)) > .94) return mix(C.cyan, C.white, .6);
        return mul(mix(C.proto, C.cyan, fil * fil), (.22 + .65 * fil * fil * fil) * (.8 + .2 * (1 - fb)));
      }
      case 81: {
        const burst = Math.floor(beat * 2) % 3 !== 2, p = y * 4 - age * 9 + hash(side * 7) * 4, f = p - Math.floor(p);
        if (burst && f < .16) return mix(C.warm, C.white, .5);
        return [.07, .02, 0];
      }
      case 82: {
        const c = .5 + .28 * Math.sin(age * .4 + side * Math.PI), d = (y - c) / .12;
        const pal = [C.teal, C.ice, C.violet], p = ((y * 2 + age * .2) % 1) * 3, a = Math.floor(p);
        const col = mix(pal[a % 3], pal[(a + 1) % 3], p - a), dust = hash(i * 9.1 + side * 3 + Math.floor(age * 2)) > .95 ? .25 : 0;
        return mix(mul(C.space, .01 + dust), col, .85 * Math.exp(-d * d));
      }
      case 83: {
        const fil = .5 + .5 * Math.sin(2 * Math.PI * (y * 2 - (side ? -1 : 1) * beat));
        if (hash(i * 5.3 + side * 11 + Math.floor(age * 16)) > .86) return C.white;
        const pal = [C.proto, C.cyan, C.violet], k = ((Math.floor(beat) % 3) + 3) % 3;
        return mul(mix(pal[k], C.white, fil * fil * .5), .5 + .5 * fil);
      }
      case 88: {
        const g = .88 + .12 * hash(i * 3.3 + side * 7 + Math.floor(age * 24));
        if (i % 8 === 2 || i % 8 === 5) return mul(mix(C.teal, C.ice, .4), (.16 + .05 * Math.sin(age * 3 + i)) * g);
        return mul(C.amber, (.13 + .14 * y) * g);
      }
      case 89: {
        const ph = beat * Math.PI / 2, pos = .5 + .44 * Math.sin(ph), v = Math.cos(ph), d = (y - pos) / .065, tail = (y - pos) * Math.sign(v);
        let k = Math.exp(-d * d); if (tail < 0 && tail > -.3) k = Math.max(k, .35 * (1 + tail / .3) * Math.abs(v));
        return mix([.02, 0, 0], C.red, k);
      }
      case 90: {
        const on = (Math.floor(beat) + (y > .5 ? 1 : 0) + side) % 2 === 0;
        return on ? mul(mix(C.red, C.orange, .15), .3 + .7 * Math.exp(-fb * 3)) : mul(C.red, .1);
      }
      case 91: {
        const lv = Math.min(1, age / (8 * SPB)), fl = .6 + .4 * Math.sin(2 * Math.PI * age * (2 + 14 * lv * lv));
        if (y > lv) return mul(C.ice, .05 * lv);
        return mul(mix(C.ice, C.white, lv * y / Math.max(lv, .01)), (.25 + .75 * lv) * fl);
      }
      case 92: {
        const q = Math.floor(beat * 2), f = beat * 2 - q; let c = mul(mix(C.orange, C.amber, y), .6 + .25 * (1 - fb));
        for (let j = 0; j < 2; j++) { const d = (y - hash(q * 3.1 + j * 7 + side * 13)) / (.05 + .12 * f); c = mix(c, mix(C.white, C.warm, f), Math.exp(-d * d) * (1 - f)); }
        return c;
      }
      case 94: {
        const h = hash(i * 4.7 + side * 23), sky = mul(C.earth, .05 + .05 * y);
        if (h > .82) return mix(sky, h > .93 ? C.warm : C.space, .22 + .18 * Math.sin(age * (.6 + h) + i));
        return sky;
      }
      // Solaris (Tarkovsky, 1972): the ocean, the two suns of the station, the highway, levitation, black and white, the island
      case 97: {
        const n = .5 + .5 * Math.sin(y * 7 + age * .6 + side * 2.1) * Math.sin(y * 3.1 - age * .37 + side);
        return mul(mix(C.ocean, mix(C.ochre, C.foam, .5 + .5 * Math.sin(age * .2 + side)), n * n), .25 + .5 * n);
      }
      case 98: return mul(mix(C.sunblue, C.white, .25 * (1 - y)), .5 + .06 * Math.sin(age * .9 + side));
      case 99: return mul(mix(C.sunred, C.amber, .3 * y), .5 + .06 * Math.sin(age * .9 + side));
      case 100: {
        const p = 1 - fb, link = .5 + .4 * Math.sin(age * .5), d = (y - link) / .05;
        return mix(mul(side ? C.sunred : C.sunblue, .45 + .55 * p * p), C.white, .9 * Math.exp(-d * d));
      }
      case 101: {
        const f = ((y * 4 + beat + side * .5) % 1 + 1) % 1;
        return f < .16 ? mul(mix(C.warm, C.white, .4), .9 * (1 - f / .16 * .5)) : [.02, .02, .025];
      }
      case 102: {
        const q = y * N - age * .8, c = Math.floor(q), h = hash(c * 2.9 + side * 31);
        const base = mul(C.amber, .14 + .05 * hash(Math.floor(age * 9) + side * 3));
        return h > .86 ? mix(base, C.warm, (.45 + .25 * Math.sin(age * 2 + c)) * (1 - Math.abs(q - c - .5))) : base;
      }
      case 103: { const g = .3 + .08 * hash(i * 3.1 + side * 7 + Math.floor(age * 24)) + .05 * Math.sin(age * 1.3); return [g, g, g * 1.02]; }
      case 104: {
        const w = Math.max(.035, .2 - age * .018), d = (y - .45) / w;
        return mix(mul(C.ocean, .14), C.warm, .85 * Math.exp(-d * d));
      }
      case 105: {
        const k = Math.min(1, age / (28 * SPB)), n = k < .29 ? 1 : k < .58 ? 2 : 4;
        const f = ((y * 4 + beat * n + side * .5) % 1 + 1) % 1, w = .16 + .1 * k;
        return f < w ? mul(mix(C.warm, C.white, k), (.35 + .65 * k) * (1 - f / w * .5)) : mul(C.warm, .02 + .06 * k);
      }
      // The Fifth Element (Besson, 1997): the vertical city, the blue diva, the gold liner, the ball of fire, the four stones, the divine light
      case 109: {
        const sky = mul(mix(C.haze, C.ice, .3 * y), .5 + .3 * y), f = ((y * 2.5 + (side ? -1 : 1) * age * .55 + side * .3) % 1 + 1) % 1;
        return f < .14 ? mix(sky, side ? C.tail : mix(C.warm, C.white, .3), .85 * (1 - f / .14)) : sky;
      }
      case 110: {
        const k = Math.pow(1 - (fb + .5) % 1, 3), d = (y - .55) / .2;
        return mix(mul(C.diva, .3 + .5 * k), C.divaglow, .6 * Math.exp(-d * d) * (.55 + .45 * k));
      }
      case 111: {
        const w = .5 + .5 * Math.sin(age * .7 + y * 9 + side * 1.7), k = Math.min(1, Math.max(0, (y - .3) / .4));
        const c = mul(mix(C.lagoon, C.gold, k), .35 + .12 * w + .15 * k);
        return y < .4 && hash(i * 5.3 + side * 11 + Math.floor(age * 4)) > .9 ? mix(c, C.white, .45) : c;
      }
      case 112: {
        const n = Math.max(0, Math.sin(y * 11 + side * 2 + age * .4) * Math.sin(y * 5.3 - age * .27 + side * 3));
        const k = Math.pow(n, 4) * Math.min(1, .35 + age / (28 * SPB)) * (.75 + .25 * Math.sin(Math.PI * beat / 2));
        return mix([.05, 0, 0], mix(C.magma, C.amber, .4 * k), k);
      }
      case 113: {
        // left: earth (bottom) and water (top); right: air (bottom) and fire (top). They open in that order, one every 2 bars
        const top = y > .5 ? 1 : 0, j = side + 2 * top, open = Math.min(1, Math.max(0, (age - j * 8 * SPB) / (2 * SPB)));
        const d = (y - (top ? .72 : .28)) / .12, k = Math.exp(-d * d), col = [[C.ochre, C.screen], [C.space, C.sunred]][side][top];
        return mix(mul(C.stone, 1.5), mix(col, C.white, .35 * open * k), k * (.12 + .8 * open));
      }
      case 114: {
        const k = Math.pow(1 - (fb + .5) % 1, 3), d = (y - .5) / .32;
        return mix(mul(C.leeloo, .55 + .2 * k), mix(C.gold, C.white, .5 + .5 * k), Math.min(1, Math.exp(-d * d) * 1.4));
      }
      // Doctor Who (2006, the Canary Wharf two-parter): the ghosts, the black sphere, the breach, the steel army, gold against steel, the grey beach, everything pulled away
      case 122: {
        const g = Math.pow(Math.max(0, Math.sin(Math.PI * (age / (3 * SPB) + side * .5))), 2), dh = (y - .82) / .07, db = (y - .45) / .26;
        const shape = Math.min(1, Math.exp(-db * db) + .8 * Math.exp(-dh * dh));
        return mix(mul(C.haze, .25), C.ghost, .75 * g * shape * (.8 + .2 * Math.sin(age * 23 + y * 40 + side)));
      }
      case 123: {
        const r = .25 + .03 * Math.sin(age * .8), d = Math.abs(y - .5);
        if (d < r) return [0, 0, 0];
        if (d < r + .07) { const k = 1 - (d - r) / .07; return mul(mix(C.lilac, C.cyan, y > .5 ? .2 : .8), k * (.35 + .2 * Math.sin(age * 1.3))); }
        return mul(mix(C.space, C.white, .3), hash(Math.floor(i / 4) + side * 9) > .2 ? .4 : .25);
      }
      case 124: {
        const k = Math.min(1, age / (16 * SPB)), w = .02 + .16 * k, d = Math.abs(y - .5), fl = .75 + .25 * Math.sin(age * (8 + 40 * k) + side * 2);
        if (d < w) return mul(mix(C.breach, C.white, k * (1 - d / w)), (.5 + .5 * k) * fl);
        return mul(C.ice, .35 * k * Math.exp(-(d - w) / .08));
      }
      case 125: {
        const q = ((Math.floor(beat) % 4) + 4) % 4, seg = 3 - Math.floor(Math.min(.999, y) * 4), k = Math.pow(1 - fb, 4);
        return mul(mix(C.steel, C.white, seg === q ? .4 * k : 0), .18 + .2 * k + (seg === q ? .62 * k : 0));
      }
      case 126: {
        const k = Math.floor(beat) % 2 === side ? Math.pow(1 - fb, 3) : 0, c = side ? C.steel : C.bronze;
        const eye = side ? 0 : Math.exp(-Math.pow((y - .88) / .04, 2)) * (.5 + .5 * Math.sin(age * 3));
        return mix(mul(c, .22 + .78 * k), C.dalek, eye);
      }
      case 127: {
        const sky = mix(C.sea, C.ghost, .5 * y), wave = y < .3 ? .6 + .4 * Math.sin(age * 1.1 - y * 14 + side) : 1;
        const h = Math.max(0, 1 - age / (22 * SPB)), dd = (y - .55) / .16, on = hash(Math.floor(age * 9) + side * 3) > .25 * (1 - h) + .1;
        return mix(mul(sky, .3 * wave), mix(C.holo, C.white, .3), on ? .7 * h * Math.exp(-dd * dd) : 0);
      }
      case 0: {
        const sp = .9 + age / (16 * SPB), f = ((y * 3 - age * sp + side * .37) % 1 + 1) % 1, c = Math.floor(y * 3 - age * sp + side * .37) % 2 ? C.steel : C.gold;
        const top = Math.exp(-Math.pow((1 - y) / .2, 2));
        return mix(f < .22 ? mul(c, .9 * (1 - f / .22)) : mul(C.steel, .1), C.white, top * .9);
      }
      // Blade Runner (Scott, 1982): rain on the city at night, searchlights, the neons, the blinds, the pyramid and its flares,
      // the flight over the city, tears in rain, the C-beams, ships on fire, the white flight, the origami
      case 6: {
        const lv = .55 + .45 * Math.min(1, age / (32 * SPB)), p = (age * .06 + side * .55) % 1.5;
        const c = mix(mul(mix(C.night, C.rain, .3 * y), .5 + .3 * lv), mix(C.rain, C.white, .3), (.3 + .2 * lv) * rainK(y, side, age, .35));
        return p < 1 ? mix(c, C.sodium, .3 * lv * Math.exp(-Math.pow((y - p) / .06, 2))) : c;
      }
      case 7: {
        const lv = .6 + .4 * Math.min(1, age / (24 * SPB));
        const p1 = .5 + .45 * Math.sin(age * .55 + side * 2.1), p2 = .5 + .45 * Math.sin(age * .31 + side * .9 + 1.3);
        const k = .5 * Math.exp(-Math.pow((y - p1) / .11, 2)) + .22 * Math.exp(-Math.pow((y - p2) / .09, 2));
        return mix(mix(mul(C.haze, .7), C.rain, .25 * rainK(y, side, age, .35)), mix(C.ice, C.white, .55), Math.min(1, k * lv));
      }
      case 8: {
        const lv = .45 + .55 * Math.min(1, age / (64 * SPB)), seg = Math.floor(i / 8);
        const on = hash(Math.floor(age * 12) + seg * 7 + side * 13) > .975 ? .2 : 1, seam = i % 8 === 0 ? .45 : 1;
        const c = mul(mix(C.neonpink, C.cyan, side ? 1 - y : y), .55 * lv * on * seam);
        return mix(c, mix(C.rain, C.white, .4), .35 * lv * rainK(y, side, age, .4));
      }
      case 9: {
        const f = ((y * 8 + age * .25) % 1 + 1) % 1, smoke = .8 + .2 * Math.sin(age * .7 + y * 5 + side * 2), p = (age * .11 + side * .45) % 1.4;
        const c = mul(C.sodium, (f < .5 ? .5 : .05) * smoke);
        return mix(c, C.warm, .45 * Math.exp(-Math.pow((y - p + .05) / .1, 2)) * (f < .5 ? 1 : .3));
      }
      case 10: {
        const c = y < .6 ? mul(mix(C.sodium, C.amber, y / .6), .12 + .4 * (1 - y / .6)) : mul(C.night, 1.5);
        const q = age / 2.3 + side * .5, ph = q % 1, h = .6 + ph * 1.15;
        if (ph < .38 && hash(Math.floor(q) * 3.7 + side) > .3 && y > .6 && y < h) {
          const k = (1 - ph / .38) * (.35 + .65 * (y - .6) / (h - .6));
          return mix(c, mix(C.orange, C.warm, k), Math.min(1, k * 1.2));
        }
        return c;
      }
      case 11: {
        const lv = .5 + .5 * Math.min(1, age / (56 * SPB));
        let c = mul(mix(C.night, C.deep, .5 + .5 * y), .9);
        for (let j = 0; j < 3; j++) {
          const f = ((y * 2 + age * (.55 + .2 * j) + hash(j * 3 + side * 5)) % 1 + 1) % 1;
          if (f < .08) c = mix(c, j === 1 ? mix(C.ice, C.white, .6) : C.sodium, .8 * lv * (1 - f / .08));
        }
        return mul(c, .45 + .45 * lv);
      }
      case 12: {
        const k = .78 + .22 * Math.pow(1 - fb, 2), seg = Math.floor(i / 8), on = hash(Math.floor(age * 12) + seg * 7 + side * 13) > .985 ? .3 : 1;
        const g = side ? 1 - y : y, c = g < .5 ? mix(C.neonpink, C.violet, g * 2) : mix(C.violet, C.cyan, g * 2 - 1);
        return mix(mul(c, .8 * k * on), mix(C.rain, C.white, .6), .45 * rainK(y, side, age, .5));
      }
      case 13: {
        const fade = Math.max(0, 1 - age / (6 * SPB));
        const c = mix(mul(C.night, .8), C.ice, .25 * rainK(y, side, age, .15) * (1 - fade * .5));
        return fade > 0 ? mix(c, base(12, i, side, age, beat), .5 * fade * fade) : c;
      }
      case 14: {
        let c = mul(C.deep, .22 + .22 * Math.pow(1 - fb, 2));
        const q = Math.floor(beat / 2);
        for (let j = 0; j < 3; j++) {
          const p = .1 + .8 * hash(j * 3.1 + side * 7 + q * 1.7), d = (y - p) / .06, g = .55 + .45 * hash(Math.floor(age * 22) + j * 5 + i * 1.3 + side);
          c = mix(c, mix(C.cyan, C.white, .55), .9 * Math.exp(-d * d) * g);
        }
        return c;
      }
      case 15: {
        const lv = .55 + .45 * Math.min(1, age / (48 * SPB)), pk = Math.pow(1 - fb, 2);
        const star = hash(i * 7.7 + side * 3.1) > .9 ? .35 + .25 * Math.sin(age * 3 + i) : 0, bg = mix(mul(C.violet, .14), C.space, star);
        const pos = .5 + .22 * Math.sin(age * .4 + side * 2), w = .12 + .14 * pk, d = (y - pos) / w;
        return mix(bg, mix(C.magma, mix(C.orange, C.warm, .6 * pk), .4 + .6 * pk), Math.min(1, Math.exp(-d * d) * lv * (.6 + .4 * pk) * 1.2));
      }
      case 16: {
        const pos = age / (6 * SPB), fade = Math.max(0, 1 - age / (12 * SPB)), d = (y - pos) / .1, trail = y < pos ? .25 * Math.exp(-(pos - y) / .25) : 0;
        return mul(mix(C.ice, C.white, .7), fade * Math.min(1, Math.exp(-d * d) + trail));
      }
      case 17: {
        const lv = Math.max(0, 1 - age / (40 * SPB)), tw = Math.pow(Math.max(0, Math.sin(age * 1.4 + side * 2)), 8);
        const c = mix(mul(mix(C.night, C.rain, .3 * y), .7), mix(C.rain, C.white, .3), .3 * rainK(y, side, age, .3));
        return mul(mix(c, C.space, .7 * tw * Math.exp(-Math.pow((y - .5) / .05, 2))), lv);
      }
      // The Matrix (Wachowski, 1999): the blinking cursor, the code rain, the real world on board the hovercraft, the sentinels,
      // the lobby shootout, bullet time, seeing the code, the red or the blue pill, the deja vu
      case 22: return y > .86 ? mul(C.code, fb < .5 ? .9 : 0) : mul(C.codeDark, .05);
      case 23: return codeRain(y, i, side, age, 3, .55, .45 + .55 * Math.min(1, age / (32 * SPB)));
      case 24: {
        const lv = .6 + .4 * Math.min(1, age / (12 * SPB)), seg = Math.floor(i / 8), seam = i % 8 === 0 ? .35 : 1, br = .75 + .25 * Math.sin(age * .9 + seg * 1.7 + side * 2);
        const fl = .7 + .3 * hash(Math.floor(age * 9) + side * 3);
        return mix(mul(mix(C.steel, C.deep, .5), .3 * lv * br * seam), C.amber, .5 * lv * fl * Math.exp(-Math.pow(y / .12, 2)));
      }
      case 25: {
        let c = mul(C.pillRed, .03);
        const n = Math.min(6, 1 + Math.floor(age / (2 * SPB)));
        for (let j = 0; j < n; j++) {
          const p = .5 + .42 * Math.sin(age * (.9 + .9 * hash(j * 4.1 + side)) + hash(j * 1.3 + side * 7) * 6.28), d = (y - p) / .045;
          c = mix(c, mix(C.pillRed, C.warm, .3 * Math.exp(-d * d * 4)), Math.min(1, 1.1 * Math.exp(-d * d)));
        }
        return c;
      }
      case 26: {
        const pk = Math.pow(1 - fb, 2), q = Math.floor(beat * 2), fe = beat * 2 - q, d = (y - hash(q * 3.1 + side * 7)) / .07;
        const c = mix(mul(mix(C.code, C.codeHead, .25 * pk), .4 + .45 * pk), codeRain(y, i, side, age, 2, .8, .8), .3);
        return mix(c, C.white, .9 * Math.exp(-d * d) * Math.exp(-fe * 4));
      }
      case 27: {
        const r = Math.abs(y - .5), w = ((r * 3 - age * .3) % 1 + 1) % 1, ring = Math.exp(-Math.pow((w - .5) / .07, 2)) * Math.exp(-r * 2.5);
        const p = Math.min(1, age / (6 * SPB)), b = side ? .9 - .8 * p : .1 + .8 * p, d = (y - b) / .035;
        return mix(mix(mul(C.codeDark, .25), mix(C.code, C.codeHead, .5), .55 * ring), C.white, Math.exp(-d * d));
      }
      case 28: {
        const pk = Math.pow(1 - fb, 2);
        return mix(mul(C.code, .2 + .3 * pk), codeRain(y, i, side, age, 6, 1.2, 1), .85);
      }
      case 29: {
        const q = Math.floor(age / 2.7), ph = age / 2.7 - q, bolt = hash(q * 5.3) > .55 && ph < .12 ? (Math.floor(ph * 60) % 2 ? .25 : .7) : 0;
        const d = (y - .5) / .13, c = mix(mul(C.haze, .7), side ? C.pillRed : C.pillBlue, (.55 + .25 * Math.sin(age * 1.3 + side * 1.5)) * Math.exp(-d * d));
        return mix(c, C.space, bolt);
      }
      // Day then night: the colours of the first reels (Sanetsch pasture, blue sky, red jacket, hi-vis vest, yellow caption),
      // the sunset, Gargantua from Interstellar (thin disk, its bent image above and below, the tick of Miller's planet),
      // the night quarry stage (cold spotlight on the cliff, amber bulbs on the ground, orange amps)
      case 31: {
        const lv = .45 + .55 * Math.min(1, age / (16 * SPB));
        let c = y < .16 ? mul(C.grass, .55 + .15 * hash(i * 1.7 + side * 5)) : mix(C.skyLow, C.skyTop, (y - .16) / .84);
        for (let j = 0; j < 2; j++) {
          const p = ((age * .03 + hash(j * 3.7 + side * 1.9)) % 1.2) - .1, d = (y - p) / .07;
          if (y > .2) c = mix(c, C.white, .5 * Math.exp(-d * d));
        }
        return mul(c, lv);
      }
      case 32: {
        const pk = Math.pow(1 - fb, 2), bb = beat - 4 * Math.floor(beat / 4), sw = side ^ (Math.floor(beat / 4) & 1);
        let c = mul(mix(C.skyLow, C.skyTop, y), .55 + .4 * pk);
        if (y < .08) c = mul(C.grass, .5);
        const d = (y - .38) / .14;
        c = mix(c, mul(sw ? C.hivis : C.jacket, .65 + .35 * pk), Math.exp(-Math.pow(d, 4)));
        if (y > .86) c = mix(c, C.tag, bb < 1 ? Math.pow(1 - bb, 1.5) : .12);
        return c;
      }
      case 33: {
        const pr = Math.min(1, age / (64 * SPB)), pk = Math.pow(1 - fb, 2), p = .75 - .9 * pr;
        const lo = mix(C.sunset, C.tag, Math.min(1, y * 1.6)), hi = mix(C.mauve, C.dusk, Math.min(1, (y - .45) / .55));
        let c = y < .45 ? lo : mix(lo, hi, Math.min(1, (y - .45) / .2));
        c = mul(c, (1 - .5 * pr) * (.8 + .2 * pk));
        const d = (y - p) / .09;
        c = mix(c, mix(C.disk, C.tag, .4), Math.exp(-d * d));
        return mix(c, C.sunset, .35 * Math.exp(-Math.abs(y - p) / .2) * (1 - pr * .5));
      }
      case 34: {
        const g = .3 + .7 * Math.min(1, age / (16 * SPB)), r = Math.abs(y - .5), dop = side ? .55 : 1;
        const wav = .7 + .3 * Math.sin(age * 2.3 + y * 25 + side * 1.3);
        let c = mul(C.disk, g * dop * Math.exp(-Math.pow(r / .045, 2)));
        c = mix(c, C.bulb, .7 * g * dop * wav * Math.exp(-Math.pow((r - .2) / .05, 2)));
        const tb = beat - 2 * Math.floor(beat / 2);
        if (y > .94 && tb < .15) c = mix(c, C.spot, 1 - tb / .15);
        return c;
      }
      case 35: {
        const px = Math.floor(i / 2), on = (n) => Math.min(1, Math.max(0, (age - n * 4 / 3 * SPB) / (.4 * SPB)));
        const pk = Math.pow(1 - fb, 2);
        let c = mul(C.rock, .22 * on(0) * (1.15 - y) * (.7 + .3 * hash(px * 5.3 + side * 2)));
        if (y > .3 && y < .58) c = mix(c, C.amp, .4 * on(3) * Math.exp(-Math.pow((y - .44) / .1, 2)));
        if (px === 15) c = mix(c, C.spot, .95 * on(0));
        if (px < 6) {
          const b = px >> 1, lit = on(1 + b * 2 + side), fl = .82 + .18 * hash(Math.floor(age * 7) + px * 3 + side * 7);
          c = mix(c, C.bulb, px % 2 ? .18 * lit : lit * fl * (.9 + .1 * pk));
        }
        return c;
      }
    }
    return [0, 0, 0];
  }
  function compute(t) {
    const beat = beatAt(t); const f = frame(beat); const age = t - timeAt(f.stB);
    // front = the Spectra on the floor in front: no note drives it yet, the renderer is ready for one.
    const tubes = [[], []]; let kick = 0, front = 0; const active = new Set(), mx = MATRIX.has(f.st), tn = TINT[f.st];  // mx: kit hits and accents turn code-green; tn: they take the A02 colours
    for (let s = 0; s < 2; s++) { const side = s ^ f.swap; for (let i = 0; i < N; i++) tubes[s][i] = base(f.st, i, side, age, beat); }
    for (const [n, b, l] of f.held) {
      active.add(n); const el = t - timeAt(b);
      if (n === 55) { const pos = ((beat - b) * 2) % 1; for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) { const d = Math.abs(i / (N - 1) - pos); if (d < .12) tubes[s][i] = mix(tubes[s][i], C.warm, 1 - d / .12); } }
      if (n === 56) { const hz = 10; const on = Math.floor(el * hz * 2) % 2 === 0; for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) tubes[s][i] = on ? C.white : [0, 0, 0]; }
      if (n === 57) { for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) tubes[s][i] = [0, 0, 0]; }
      if (n === 86) { const pos = 1 - Math.min(1, (beat - b) / l); for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) { const d = Math.abs(i / (N - 1) - pos); if (d < .1) tubes[s][i] = mix(tubes[s][i], C.white, 1 - d / .1); } }
      if (n === 50) { const hz = 12; kick = Math.max(kick, (Math.floor(el * hz * 2) % 2 === 0) ? 1 : 0); }
    }
    for (const [n, b] of f.imp) {
      const el = t - timeAt(b);
      if (n === 51) { const dec = .16; if (el < dec * 3) { kick = Math.max(kick, Math.exp(-el / dec)); active.add(n); } }
      if (n === 87) { if (el < .36) { kick = Math.max(kick, .32 * Math.exp(-el / .12)); active.add(n); } }
      if (n === 84) {
        const k = Math.exp(-el / .05);
        if (k > .02) { active.add(n); for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) tubes[s][i] = mix(tubes[s][i], C.space, k); }
      }
      if (n === 85) {
        const k = .5 * Math.exp(-el / .15);
        if (k > .02) { active.add(n); const s = hash(b * 7.7) > .5 ? 1 : 0, c = 3 + Math.floor(hash(b * 3.3) * (N - 6));
          for (let i = c - 1; i <= c + 1; i++) tubes[s][i] = mix(tubes[s][i], mix(C.ice, C.white, .6), k * (i === c ? 1 : .5)); }
      }
      if (n === 93) {
        const k = Math.exp(-el / .045);
        if (k > .03) { active.add(n); const s = hash(b * 5.1) > .5 ? 1 : 0, c = 2 + Math.floor(hash(b * 9.7) * (N - 4));
          for (let i = c - 2; i <= c + 2; i++) tubes[s][i] = mix(tubes[s][i], C.white, k * (Math.abs(i - c) < 2 ? 1 : .5)); }
      }
      if (n >= 106 && n <= 108) {
        const k = Math.exp(-el / .09), c = [.83, .5, .17][n - 106];
        if (k > .02) { active.add(n); for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) { const d = Math.abs(i / (N - 1) - c); if (d < .17) tubes[s][i] = mix(tubes[s][i], C.white, k * Math.min(1, (.17 - d) / .05)); } }
      }
      if (n >= 115 && n <= 119) {
        const k = Math.exp(-el / .12), c = [.9, .7, .5, .3, .1][n - 115];
        if (k > .02) { active.add(n); for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) { const d = Math.abs(i / (N - 1) - c); if (d < .13) tubes[s][i] = mix(tubes[s][i], mix(C.leeloo, C.white, .2 * k), k * Math.min(1, (.13 - d) / .04)); } }
      }
      if (n === 2 || n === 3) {
        const k = Math.exp(-el / .13), h = .1 + .4 * k, col = mx ? mix(C.code, C.codeHead, .5) : tn ? tn.kick : mix(C.ice, C.white, .65);
        if (k > .03) { active.add(n); const s = n - 2; for (let i = 0; i < N; i++) { const y = i / (N - 1); if (y < h) tubes[s][i] = mix(tubes[s][i], col, k * (1 - .6 * y / h)); } }
      }
      if (n === 4) {
        if (el < .22) { active.add(n); const pos = 1.1 - el / .17, g = .3 * Math.exp(-el / .05);
          for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) { const d = Math.abs(i / (N - 1) - pos); tubes[s][i] = mix(tubes[s][i], mx ? C.codeHead : tn ? tn.snare : C.white, Math.min(1, g + (d < .16 ? 1 - d / .16 : 0))); } }
      }
      if (n === 5) {
        const k = .85 * Math.exp(-el / .05);
        if (k > .03) { active.add(n); const s = hash(b * 3.1) > .5 ? 1 : 0, c = N - 2 - Math.floor(hash(b * 7.3) * 4);
          for (let i = c - 1; i <= c + 1; i++) tubes[s][i] = mix(tubes[s][i], mx ? C.codeHead : tn ? tn.hat : mix(C.ice, C.white, .7), k * (i === c ? 1 : .45)); }
      }
      if (n === 1) {
        const k = el < .05 ? 1 : el < .09 ? .1 : .85 * Math.exp(-(el - .09) / .06);
        if (k > .02) { active.add(n); for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) tubes[s][i] = mix(tubes[s][i], mix(C.xray, C.white, .4 * k), k); }
      }
      if (n === 120 || n === 121) {
        const k = .95 * Math.exp(-el / .11);
        if (k > .02) { active.add(n); const s = n - 120; for (let i = 0; i < N; i++) tubes[s][i] = mix(tubes[s][i], C.leeloo, k); }
      }
      if (n === 95 || n === 96) {
        const k = .42 * Math.exp(-el / .18);
        if (k > .02) { active.add(n); const s = n === 95 ? 0 : 1; for (let i = 0; i < N; i++) tubes[s][i] = mix(tubes[s][i], mix(C.warm, C.space, .5), k); }
      }
      if (n === 18) {
        if (el < .9) { active.add(n); const s = hash(b * 4.3) > .5 ? 1 : 0, pos = .95 - el / .75, a = .75 * Math.min(1, el / .04) * (1 - el / .9);
          for (let i = 0; i < N; i++) { const d = i / (N - 1) - pos, k = d < 0 ? Math.exp(-d * d / .002) : Math.exp(-d / .12); tubes[s][i] = mix(tubes[s][i], mix(C.ice, C.white, .6), a * k); } }
      }
      if (n === 19 || n === 20) {
        const k = Math.exp(-el / .18), h = .15 + .55 * k;
        if (k > .03) { active.add(n); const s = n - 19; for (let i = 0; i < N; i++) { const y = i / (N - 1); if (y < h) tubes[s][i] = mix(tubes[s][i], mix(C.orange, C.warm, 1 - y / h), k * (1 - .5 * y / h)); } }
      }
      if (n === 21) {
        const k = Math.exp(-el / .07), c = .15 + .7 * hash(b * 6.1);
        if (k > .03) { active.add(n); for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) { const d = (i / (N - 1) - c) / .09; tubes[s][i] = mix(tubes[s][i], mix(C.cyan, C.white, .6), k * Math.exp(-d * d)); } }
      }
      if (n === 30) {
        if (el < .42) { active.add(n); const ph = el < .18 ? el / .18 : el > .22 ? (el - .22) / .18 : -1;
          for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) { const d = (i / (N - 1) - (1.1 - 1.2 * ph)) / .08; tubes[s][i] = mix(mul(tubes[s][i], .2), C.codeHead, ph >= 0 && ph <= 1 ? Math.exp(-d * d) : 0); } }
      }
      if (n === 52 || n === 53 || n === 54) {
        const k = .85 * Math.exp(-el / .14);
        if (k > .02) { active.add(n); for (let s = 0; s < 2; s++) { if (n === 53 && s === 1) continue; if (n === 54 && s === 0) continue; for (let i = 0; i < N; i++) tubes[s][i] = mix(tubes[s][i], mx ? mix(C.code, C.codeHead, .6) : tn ? tn.acc : C.warm, k); } }
      }
    }
    return { beat, f, tubes, kick, front, active };
  }

  // ---------- Render ----------
  // Rig v0.3: two matte-black monoliths (2.25 × 1 m), each with two Astera Titan Tubes (1 m, 16 pixels) set as //
  // at 70°, the strobe in the transparent kick drum (the sphere) and the Spectra strobe-wash on the floor in front.
  // A side's 32-value column is shown on both tubes of its monolith, two values per Titan pixel.
  // Drawn in a 1600 × 900 scene (1 m = 160) with additive light and no attenuation: flashes blow out like on stage.
  const cv = $('stage'), cx = cv.getContext('2d');
  function resize() { const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.max(1, Math.round(r.width * d)); cv.height = Math.max(1, Math.round(r.height * d)); }
  new ResizeObserver(resize).observe(cv);
  const avg = (a) => { let r = 0, g = 0, b = 0; a.forEach((c) => { r += c[0]; g += c[1]; b += c[2]; }); return [r / a.length, g / a.length, b / a.length]; };
  const SW = 1600, SH = 900, FLOOR = 720, MW = 160, MH = 360, MTOP = FLOOR - MH, MONOS = [260, 1340], TP = 16;
  const KX = 800, KY = 634, KR = 46, ANG = 70 * Math.PI / 180, GAP = 28, BL = 160, BCY = MTOP + MH * .4;
  const BARS = MONOS.map((mx) => [mx - GAP / 2, mx + GAP / 2].map((x) => {
    const dx = BL * Math.cos(ANG) / 2, dy = BL * Math.sin(ANG) / 2; return [x - dx, BCY + dy, x + dx, BCY - dy];
  }));
  const lumOf = (c) => Math.max(c[0], c[1], c[2]);
  const norm = (c) => { const l = lumOf(c); return l > 0 ? mul(c, 1 / l) : [0, 0, 0]; };
  const css = (c, a) => `rgba(${c.map((v) => Math.round(Math.min(1, v) * 255)).join(',')},${Math.max(0, Math.min(1, a))})`;
  function line(x0, y0, x1, y1) { cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y1); cx.stroke(); }
  function ell(x, y, rx, ry, r) { cx.beginPath(); cx.ellipse(x, y, rx, ry, r || 0, 0, Math.PI * 2); cx.stroke(); }
  function glow(x, y, r, c, a, sy) {
    if (a <= .004) return; cx.save(); cx.translate(x, y); cx.scale(1, sy || 1);
    const g = cx.createRadialGradient(0, 0, 0, 0, 0, r); g.addColorStop(0, css(c, a)); g.addColorStop(1, css(c, 0));
    cx.fillStyle = g; cx.fillRect(-r, -r, 2 * r, 2 * r); cx.restore();
  }
  function drums(lit) {
    const tri = (x) => { line(x, 664, x - 16, 680); line(x, 664, x + 16, 680); line(x, 664, x, 680); };
    cx.lineWidth = 2; cx.lineCap = 'round'; cx.strokeStyle = `rgba(200,212,228,${Math.min(1, .28 + .7 * lit)})`;
    cx.strokeRect(742, 542, 50, 40); ell(767, 542, 25, 5);
    cx.strokeRect(806, 536, 54, 42); ell(833, 536, 27, 5); line(800, 588, 800, 578);
    cx.strokeRect(880, 602, 60, 60); ell(910, 602, 30, 6); line(884, 662, 878, 680); line(936, 662, 942, 680);
    cx.strokeRect(690, 606, 52, 20); ell(716, 606, 26, 5); line(716, 626, 716, 664); tri(716);
    line(648, 680, 648, 562); ell(648, 562, 34, 4); ell(648, 570, 34, 4); tri(648);
    line(690, 664, 706, 470); ell(706, 470, 46, 6, -.16); tri(690);
    line(968, 664, 958, 500); ell(958, 500, 54, 7, .12); tri(968);
    line(910, 600, 892, 452); ell(892, 452, 42, 6, .1);
    line(770, 666, 758, 680); line(830, 666, 842, 680);
  }
  function draw(S) {
    const s = cv.width / SW; cx.setTransform(s, 0, 0, s, 0, 0); cx.globalCompositeOperation = 'source-over';
    cx.fillStyle = '#06080b'; cx.fillRect(0, 0, SW, FLOOR); cx.fillStyle = '#040506'; cx.fillRect(0, FLOOR, SW, SH - FLOOR);
    const px = S.tubes.map((tb) => Array.from({ length: TP }, (_, j) => mix(tb[2 * j], tb[2 * j + 1], .5)));
    const am = px.map(avg), al = am.map(lumOf), an = am.map(norm), k = S.kick, f = S.front;

    // light thrown on the back wall and the floor
    cx.globalCompositeOperation = 'lighter';
    MONOS.forEach((mx, m) => { glow(mx, BCY, 560, an[m], .5 * al[m]); glow(mx, FLOOR + 6, 300, an[m], .7 * al[m], .14); });
    // the strobe in the transparent kick floods the stage at full power
    glow(KX, KY, 1150, [1, 1, 1], .9 * k); glow(KX, FLOOR + 6, 700, [1, 1, 1], .8 * k, .16);
    cx.globalCompositeOperation = 'source-over';
    cx.strokeStyle = '#1d232b'; cx.lineWidth = 2; line(0, FLOOR, SW, FLOOR);

    MONOS.forEach((mx, m) => {
      const x0 = mx - MW / 2, face = Math.round(11 + 150 * f);
      cx.fillStyle = `rgb(${face},${face + 2},${face + 5})`; cx.fillRect(x0, MTOP, MW, MH);
      // the tubes light the face of their own monolith
      cx.save(); cx.beginPath(); cx.rect(x0, MTOP, MW, MH); cx.clip(); cx.globalCompositeOperation = 'lighter';
      glow(mx, BCY, 170, an[m], .45 * al[m]); cx.restore();
      cx.strokeStyle = css(mix([.13, .16, .19], an[m], .5), .5 + .5 * al[m]); cx.lineWidth = 1.5; cx.strokeRect(x0, MTOP, MW, MH);
      BARS[m].forEach(([xa, ya, xb, yb]) => {
        cx.lineCap = 'round'; cx.strokeStyle = '#030405'; cx.lineWidth = 15; line(xa, ya, xb, yb);
        cx.lineCap = 'butt'; cx.strokeStyle = '#161b22'; cx.lineWidth = 7; line(xa, ya, xb, yb);
        cx.save(); cx.globalCompositeOperation = 'lighter';
        px[m].forEach((c, i) => {
          const l = lumOf(c); if (l < .01) return;
          const n = norm(c), sx = xa + (xb - xa) * i / TP, sy = ya + (yb - ya) * i / TP, ex = xa + (xb - xa) * (i + 1) / TP, ey = ya + (yb - ya) * (i + 1) / TP;
          cx.shadowColor = css(n, l); cx.shadowBlur = 40 * s * l;
          cx.strokeStyle = css(n, .45 * l); cx.lineWidth = 26; line(sx, sy, ex, ey);
          cx.shadowBlur = 0; cx.strokeStyle = css(mix(n, [1, 1, 1], l * l * .75), Math.min(1, l * 1.6)); cx.lineWidth = 7; line(sx, sy, ex, ey);
        });
        cx.restore();
      });
    });

    cx.fillStyle = `rgb(${Math.round(13 + 120 * f)},${Math.round(16 + 120 * f)},${Math.round(21 + 120 * f)})`; cx.fillRect(560, 680, 480, 40);
    cx.strokeStyle = '#232a33'; cx.lineWidth = 2; cx.strokeRect(560, 680, 480, 40);
    drums(Math.max(k, f, .3 * Math.max(al[0], al[1])));

    // the sphere: LED inside the kick drum
    cx.save(); cx.globalCompositeOperation = 'lighter';
    const g = cx.createRadialGradient(KX, KY, 0, KX, KY, KR);
    g.addColorStop(0, css([1, 1, 1], .05 + .95 * k)); g.addColorStop(.7, css([.85, .9, 1], .04 + .8 * k)); g.addColorStop(1, css([.85, .9, 1], .03 + .6 * k));
    cx.fillStyle = g; cx.shadowColor = css([1, 1, 1], k); cx.shadowBlur = 70 * s * k;
    cx.beginPath(); cx.arc(KX, KY, KR, 0, Math.PI * 2); cx.fill(); cx.restore();
    cx.lineWidth = 3; cx.strokeStyle = css([.9, .93, 1], .3 + .7 * k); cx.beginPath(); cx.arc(KX, KY, KR, 0, Math.PI * 2); cx.stroke();

    // Spectra from the front: a full flash blows the whole stage out
    if (f > .01) {
      cx.globalCompositeOperation = 'lighter';
      glow(KX, SH + 120, 1300, [1, 1, 1], f);
      cx.fillStyle = css([1, 1, 1], .6 * f); cx.fillRect(0, 0, SW, SH);
    }
    cx.globalCompositeOperation = 'source-over';
    const v = cx.createRadialGradient(SW / 2, SH / 2, 320, SW / 2, SH / 2, 1000);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${.5 * (1 - f)})`); cx.fillStyle = v; cx.fillRect(0, 0, SW, SH);
  }

  // ---------- Clock (the embedded master is the clock) ----------
  const audio = $('player'), playBtn = $('play');
  let playing = false;
  const now = () => audio.currentTime || 0;
  function seek(t) { t = Math.max(0, Math.min(DUR, t)); try { audio.currentTime = t; } catch (e) {} }
  function setPlay(p) {
    playing = p;
    if (p) audio.play().catch(() => { playing = false; playBtn.textContent = 'Lecture'; });
    else audio.pause();
    playBtn.textContent = p ? 'Pause' : 'Lecture';
  }
  playBtn.onclick = () => setPlay(!playing);
  $('back').onclick = () => seek(0);
  $('prevbar').onclick = () => seek(now() - stepNav());
  $('nextbar').onclick = () => seek(now() + stepNav());
  audio.onended = () => setPlay(false);

  const tl = $('tl'), ph = $('ph');
  function tlSeek(x) { const r = tl.getBoundingClientRect(); seek((x - r.left) / r.width * DUR); }
  let drag = false;
  tl.addEventListener('pointerdown', (e) => { drag = true; tl.setPointerCapture(e.pointerId); tlSeek(e.clientX); });
  tl.addEventListener('pointermove', (e) => { if (drag) tlSeek(e.clientX); });
  tl.addEventListener('pointerup', () => { drag = false; });
  document.addEventListener('keydown', (e) => {
    const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    if (typing || $('app').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.code === 'Space' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); playBtn.click(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); seek(now() + stepNav()); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); seek(now() - stepNav()); }
    else if (e.key === 'c' || e.key === 'C') { e.preventDefault(); openForm(); }
  });

  // ---------- Audio loading (fetched with the token, played from a local blob) ----------
  const audioCache = {};
  async function loadAudio(s) {
    const msg = $('audio-msg');
    playBtn.disabled = true;
    if (audioCache[s.key]) { useAudio(s); return; }
    audio.removeAttribute('src'); audio.load();
    msg.textContent = 'Chargement du son…';
    try {
      const r = await api('audio/' + s.audio);
      if (!r.ok) throw new Error('Son introuvable');
      const total = +r.headers.get('Content-Length') || 0;
      const reader = r.body.getReader(); const chunks = []; let got = 0;
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        chunks.push(value); got += value.length;
        if (total && song === s) msg.textContent = 'Chargement du son… ' + Math.round(got / total * 100) + ' %';
      }
      audioCache[s.key] = URL.createObjectURL(new Blob(chunks, { type: 'audio/mpeg' }));
      if (song === s) useAudio(s);
    } catch (e) {
      if (e.message !== 'auth') msg.textContent = 'Le son n’a pas pu être chargé. Recharge la page.';
    }
  }
  let pendingSeek = null;
  function useAudio(s) {
    audio.addEventListener('loadedmetadata', () => {
      if (song !== s) return;
      if (isFinite(audio.duration) && audio.duration > 0) { DUR = audio.duration; buildTL(); buildMarks(); }
      seek(pendingSeek != null ? pendingSeek : s.start || 0);
    }, { once: true });
    audio.src = audioCache[s.key];
    $('audio-msg').textContent = ''; playBtn.disabled = false;
  }

  // ---------- Song switch ----------
  function buildLegend() {
    const lg = $('legend'); lg.textContent = '';
    const used = new Set(EV.map((e) => e[1]));
    Object.keys(NAMES).filter((k) => used.has(+k)).forEach((k) => {
      const d = document.createElement('div'); d.className = 'ls-lg';
      const sw = document.createElement('span'); sw.className = 'ls-sw'; sw.style.background = rgb(SWATCH[k]);
      const t = document.createElement('div'); const b = document.createElement('b'); b.textContent = k + ' · ' + NAMES[k];
      t.append(b, DESC[k]); d.append(sw, t); lg.append(d);
    });
  }
  function buildTL() {
    tl.querySelectorAll('.ls-seg').forEach((e) => e.remove());
    SEC.forEach((s, i) => {
      const e = document.createElement('div'); e.className = 'ls-seg' + (s[3] ? ' light' : '');
      const end = i < SEC.length - 1 ? SEC[i + 1][0] : DUR;
      e.style.left = (s[0] / DUR * 100) + '%'; e.style.width = ((end - s[0]) / DUR * 100) + '%'; e.style.background = s[2];
      e.textContent = s[1]; tl.insertBefore(e, ph);
    });
    tl.setAttribute('aria-valuemax', String(Math.round(DUR)));
  }
  function loadSong(key, at) {
    const s = SONGS.find((x) => x.key === key) || SONGS[0]; if (!s) return;
    if (playing) setPlay(false);
    song = s; EV = (s.ev || []).slice().sort((a, b) => a[0] - b[0]); SEC = s.sec || []; BPM = s.bpm || 0; SPB = BPM ? 60 / BPM : 0; OFF = s.off || 0; DUR = s.dur || 1; setTempo(s);
    pendingSeek = at != null ? at : null;
    $('hcode').textContent = (s.track ? String(s.track).padStart(2, '0') + ' · ' : '') + s.code + ' //';
    $('htitle').textContent = s.name;
    $('hinfo').textContent = hasPlan()
      ? 'Plan lumière ' + s.ver + ' · ' + [...new Set(TM.map((x) => x[1]))].join('/') + ' BPM · ' + EV.length + ' déclenchements'
      : 'Pas encore de plan lumière. Écoute et note tes idées au bon moment : elles serviront à le construire.';
    $('prevbar').textContent = SPB ? '−1 mes.' : '−5 s'; $('nextbar').textContent = SPB ? '+1 mes.' : '+5 s';
    $('cf-minus').textContent = SPB ? '− 1 temps' : '− 0,5 s'; $('cf-plus').textContent = SPB ? '+ 1 temps' : '+ 0,5 s';
    $('comment').textContent = hasPlan() ? 'Commenter ici' : 'Proposer une idée ici';
    $('cf-title').textContent = hasPlan() ? 'Nouveau commentaire' : 'Nouvelle idée';
    $('legend-wrap').hidden = !hasPlan();
    document.title = s.code + ' — Light show — The Clive';
    document.querySelectorAll('#songs .btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === key)));
    buildLegend(); buildTL(); closeForm(); lastChips = null;
    comments = []; renderComments(); loadComments();
    loadAudio(s);
    history.replaceState(null, '', '#' + s.key + (at != null ? '@' + at.toFixed(2) : ''));
  }

  // ---------- Comments ----------
  let comments = [], replyTo = null;
  const clist = $('clist');
  async function loadComments() {
    if (!song) return; const key = song.key;
    try {
      const d = await apiJson('comments?song=' + encodeURIComponent(key));
      if (song && song.key === key) { comments = d.comments; renderComments(); }
    } catch (e) {}
  }
  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function actionBtn(label, fn) { const b = el('button', 'copy', label); b.type = 'button'; b.onclick = fn; return b; }

  function renderComments() {
    const showDone = $('show-done').checked;
    const roots = comments.filter((c) => !c.parent);
    const kids = {}; comments.filter((c) => c.parent).forEach((c) => { (kids[c.parent] = kids[c.parent] || []).push(c); });
    const open = roots.filter((c) => !c.resolved).length;
    $('ccount').textContent = 'Commentaires · ' + open + ' ouvert' + (open > 1 ? 's' : '') + (roots.length - open ? ' · ' + (roots.length - open) + ' réglé' + (roots.length - open > 1 ? 's' : '') : '');
    clist.textContent = '';
    const shown = roots.filter((c) => showDone || !c.resolved);
    $('cempty').hidden = shown.length > 0;
    if (!shown.length && roots.length) { $('cempty').hidden = false; $('cempty').textContent = 'Tous les points sont réglés.'; }
    else $('cempty').textContent = 'Rien pour ce morceau. Lance la lecture et clique sur « ' + $('comment').textContent + ' » au moment voulu.';
    for (const c of shown) {
      const li = el('li', 'ls-c' + (c.resolved ? ' done' : '')); li.dataset.t = c.t; li.dataset.id = c.id;
      const top = el('div', 'ls-ctop');
      const tb = el('button', 'ls-time', fmtShort(c.t) + (SPB ? ' · mes. ' + barOf(c.t) : '')); tb.type = 'button';
      tb.title = 'Écouter depuis 2 secondes avant'; tb.onclick = () => { seek(c.t - 2); if (!playBtn.disabled) setPlay(true); };
      top.append(tb); if (where(c.t)) top.append(el('span', 'ls-ctx', where(c.t)));
      if (song && (c.ver || '') !== (song.ver || '')) top.append(el('span', 'ls-tag', c.ver ? 'sur ' + c.ver : 'avant le plan'));
      if (c.resolved) top.append(el('span', 'ls-tag ok', 'Réglé'));
      const meta = el('p', 'ls-cmeta'); meta.append(el('b', null, c.author), ' · ' + fmtDate(c.created_at));
      li.append(top, meta, el('p', 'ls-cbody', c.body));
      const rs = kids[c.id] || [];
      if (rs.length) {
        const ul = el('ul', 'ls-replies');
        rs.forEach((r) => { const ri = el('li'); const m = el('p', 'ls-cmeta'); m.append(el('b', null, r.author), ' · ' + fmtDate(r.created_at)); ri.append(m, el('p', 'ls-cbody', r.body)); ul.append(ri); });
        li.append(ul);
      }
      const act = el('div', 'ls-cact');
      act.append(
        actionBtn('Répondre', () => openReply(li, c)),
        actionBtn(c.resolved ? 'Rouvrir' : 'Marquer réglé', () => setResolved(c, !c.resolved)),
        actionBtn('Copier le lien', (e) => copyLink(c, e.currentTarget)),
        actionBtn('Supprimer', () => removeComment(c)),
      );
      li.append(act);
      if (replyTo === c.id) li.append(replyForm(c));
      clist.append(li);
    }
    buildMarks();
  }
  function buildMarks() {
    tl.querySelectorAll('.ls-mark').forEach((e) => e.remove());
    comments.filter((c) => !c.parent).forEach((c) => {
      const m = el('span', 'ls-mark' + (c.resolved ? ' done' : '')); m.style.left = (c.t / DUR * 100) + '%'; tl.insertBefore(m, ph);
    });
  }
  function openReply(li, c) { replyTo = replyTo === c.id ? null : c.id; renderComments(); const f = clist.querySelector('.ls-rform textarea'); if (f) f.focus(); }
  function replyForm(c) {
    const f = el('form', 'ls-rform');
    const name = el('input', 'ls-input'); name.maxLength = 40; name.placeholder = 'Ton nom'; name.required = true; name.value = store.get('ls_author') || ''; name.setAttribute('aria-label', 'Ton nom');
    const ta = el('textarea', 'ls-input'); ta.rows = 2; ta.maxLength = 1500; ta.required = true; ta.placeholder = 'Ta réponse'; ta.setAttribute('aria-label', 'Ta réponse');
    const row = el('div', 'ls-row'); const send = el('button', 'btn solid', 'Répondre'); send.type = 'submit';
    const cancel = el('button', 'btn', 'Annuler'); cancel.type = 'button'; cancel.onclick = () => { replyTo = null; renderComments(); };
    row.append(send, cancel); f.append(name, ta, row);
    f.onsubmit = async (e) => {
      e.preventDefault(); if (!name.value.trim() || !ta.value.trim()) return;
      send.disabled = true; store.set('ls_author', name.value.trim());
      try {
        const d = await apiJson('comments', { method: 'POST', body: { song: song.key, ver: song.ver, t: c.t, author: name.value.trim(), body: ta.value.trim(), parent: c.id } });
        comments.push(d.comment); replyTo = null; renderComments();
      } catch (err) { send.disabled = false; }
    };
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) f.requestSubmit(); });
    return f;
  }
  async function setResolved(c, v) {
    try { await apiJson('comments/' + c.id, { method: 'PATCH', body: { resolved: v } }); c.resolved = v ? 1 : 0; renderComments(); } catch (e) {}
  }
  async function removeComment(c) {
    if (!confirm('Supprimer ce commentaire' + (comments.some((x) => x.parent === c.id) ? ' et ses réponses' : '') + ' ?')) return;
    try { await apiJson('comments/' + c.id, { method: 'DELETE' }); comments = comments.filter((x) => x.id !== c.id && x.parent !== c.id); renderComments(); } catch (e) {}
  }
  function copyLink(c, btn) {
    const url = location.origin + location.pathname + '#' + song.key + '@' + Math.max(0, c.t - 2).toFixed(2);
    const done = () => { btn.textContent = 'Lien copié'; setTimeout(() => { btn.textContent = 'Copier le lien'; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt('Lien :', url)); else prompt('Lien :', url);
  }
  $('show-done').onchange = renderComments;

  // New comment form
  const cform = $('cform'); let cfT = 0;
  function updateFormAt() { $('cf-at').textContent = fmt(cfT) + (SPB ? ' · mesure ' + barOf(cfT) : ''); $('cf-ctx').textContent = where(cfT); }
  function openForm() {
    if (!song) return;
    if (playing) setPlay(false);
    cfT = now(); updateFormAt(); $('cf-msg').textContent = '';
    cform.hidden = false;
    $('cf-author').value = $('cf-author').value || store.get('ls_author') || '';
    ($('cf-author').value ? $('cf-body') : $('cf-author')).focus({ preventScroll: true });
    cform.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function closeForm() { cform.hidden = true; $('cf-body').value = ''; }
  $('comment').onclick = openForm;
  $('cf-cancel').onclick = closeForm;
  $('cf-minus').onclick = () => { cfT = Math.max(0, cfT - stepFine()); updateFormAt(); seek(cfT); };
  $('cf-plus').onclick = () => { cfT = Math.min(DUR, cfT + stepFine()); updateFormAt(); seek(cfT); };
  $('cf-replay').onclick = () => { seek(cfT - 3); setPlay(true); setTimeout(() => { if (playing) setPlay(false); }, 4500); };
  $('cf-body').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) cform.requestSubmit(); });
  cform.onsubmit = async (e) => {
    e.preventDefault();
    const author = $('cf-author').value.trim(), body = $('cf-body').value.trim(), msg = $('cf-msg');
    if (!author || !body) { msg.textContent = 'Ton nom et le commentaire sont obligatoires.'; return; }
    store.set('ls_author', author);
    const btn = cform.querySelector('button[type=submit]'); btn.disabled = true; msg.textContent = 'Envoi…';
    try {
      const d = await apiJson('comments', { method: 'POST', body: { song: song.key, ver: song.ver, t: Math.round(cfT * 100) / 100, author, body } });
      comments.push(d.comment); comments.sort((a, b) => a.t - b.t || a.id - b.id); renderComments(); closeForm();
    } catch (err) { msg.textContent = err.message === 'auth' ? '' : 'Envoi impossible : ' + err.message; }
    btn.disabled = false;
  };

  // ---------- Main loop ----------
  let lastChips = '', lastNow = 0;
  function loop(ts) {
    if (song) {
      const t = Math.min(now(), DUR); const S = compute(t); draw(S);
      const bar = barOf(t);
      const st = hasPlan() ? NAMES[S.f.st] : '—';
      $('rtime').textContent = fmt(t); $('rbar').textContent = bar; $('rstate').textContent = st; $('rsec').textContent = secOf(t) || '—';
      $('osdState').textContent = hasPlan() ? st + (S.f.swap ? ' · SWAP' : '') : 'PAS ENCORE DE PLAN'; $('osdTime').textContent = fmt(t) + (SPB ? ' · ' + bar : '');
      ph.style.left = (t / DUR * 100) + '%'; tl.setAttribute('aria-valuenow', String(Math.round(t))); tl.setAttribute('aria-valuetext', fmt(t) + ', mesure ' + bar);
      const chips = [...S.active].sort().map((n) => `<span class="ls-chip${HOT.has(n) ? ' hot' : ''}">${NAMES[n]}</span>`).join('');
      if (chips !== lastChips) { $('chips').innerHTML = chips; lastChips = chips; }
      if (ts - lastNow > 200) { lastNow = ts; clist.querySelectorAll('.ls-c').forEach((li) => { const ct = +li.dataset.t; li.classList.toggle('now', t >= ct - .5 && t <= ct + 2.5); }); }
    }
    requestAnimationFrame(loop);
  }

  // ---------- Auth and start ----------
  function logout() {
    token = null; store.set('ls_token', null);
    if (playing) setPlay(false);
    $('app').hidden = true; $('logout').hidden = true; $('login').hidden = false;
  }
  $('logout').onclick = logout;
  $('login-form').onsubmit = async (e) => {
    e.preventDefault(); const msg = $('login-msg'); msg.textContent = 'Vérification…';
    try {
      const d = await apiJson('login', { method: 'POST', body: { password: $('pw').value } });
      token = d.token; store.set('ls_token', token); $('pw').value = ''; msg.textContent = ''; start();
    } catch (err) { msg.textContent = err.message.startsWith('Erreur 404') || err.message.startsWith('Erreur 5') ? 'Le service n’est pas encore en ligne.' : err.message; }
  };

  function parseHash() { const m = location.hash.match(/^#([a-z0-9-]+)(?:@([\d.]+))?$/); return m ? { key: m[1], at: m[2] != null ? +m[2] : null } : null; }
  window.addEventListener('hashchange', () => { const h = parseHash(); if (h && SONGS.length) { if (song && h.key === song.key && h.at != null) seek(h.at); else loadSong(h.key, h.at); } });

  async function start() {
    try {
      const r = await api('songs');
      if (!r.ok) throw new Error('songs');
      const d = await r.json(); SONGS = d.songs || [];
    } catch (e) {
      if (e.message !== 'auth') { $('login').hidden = false; $('login-msg').textContent = 'Les morceaux n’ont pas pu être chargés.'; }
      return;
    }
    $('login').hidden = true; $('app').hidden = false; $('logout').hidden = false;
    const songs = $('songs'); songs.textContent = '';
    SONGS.forEach((s) => { const b = el('button', 'btn' + (s.ev && s.ev.length ? '' : ' noplan'), s.code + ' // ' + s.name); b.title = s.ev && s.ev.length ? 'Plan lumière ' + s.ver : 'Pas encore de plan lumière'; b.type = 'button'; b.dataset.k = s.key; b.setAttribute('aria-pressed', 'false'); b.onclick = () => loadSong(s.key); songs.append(b); });
    resize();
    const h = parseHash();
    loadSong(h && SONGS.some((s) => s.key === h.key) ? h.key : SONGS[0].key, h ? h.at : null);
  }

  // Refresh comments every 30 s while the tab is visible, so everyone sees the others' notes.
  setInterval(() => { if (song && !document.hidden && !$('app').hidden && cform.hidden && replyTo == null) loadComments(); }, 30000);

  requestAnimationFrame(loop);
  if (token) start(); else $('login').hidden = false;
})();
