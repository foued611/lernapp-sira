// Lernstoff der App "Cahier de Verbes": Verben, Beispielsätze, Hinweise und Merkzettel.
// Neue Verben oder Sätze nur hier ergänzen, die Logik bleibt unverändert.
//
// V        alle Verben (unregelmäßige mit forms, regelmäßige mit stem und group)
// UNITS    die Lernpfad-Seiten
// RAW      Beispielsätze pro Seite: [Verb, Person 0-5, Satz mit ___, Übersetzung]
// HINT     Erklärung pro Form bei Fehlern (unregelmäßige Verben)
// TIPS     Merkzettel der Theorie-Seite

export const ER=['e','es','e','ons','ez','ent'],IR=['is','is','it','issons','issez','issent'],RE=['s','s','','ons','ez','ent'];
export const GE={er:ER,ir:IR,re:RE};
export const PRON=['je','tu','il / elle / on','nous','vous','ils / elles'];
export const PQV=[['je'],['tu'],['il','elle','on'],['nous'],['vous'],['ils','elles']];
export const V={
 etre:{inf:'être',de:'sein',forms:['suis','es','est','sommes','êtes','sont'],deF:['ich bin','du bist','er/sie/es ist','wir sind','ihr seid','sie sind']},
 avoir:{inf:'avoir',de:'haben',forms:['ai','as','a','avons','avez','ont'],deF:['ich habe','du hast','er/sie/es hat','wir haben','ihr habt','sie haben']},
 aller:{inf:'aller',de:'gehen',forms:['vais','vas','va','allons','allez','vont'],deF:['ich gehe','du gehst','er/sie/es geht','wir gehen','ihr geht','sie gehen']},
 faire:{inf:'faire',de:'machen',forms:['fais','fais','fait','faisons','faites','font'],deF:['ich mache','du machst','er/sie/es macht','wir machen','ihr macht','sie machen']},
 parler:{de:'sprechen',stem:'parl',group:'er'},
 aimer:{de:'mögen, lieben',stem:'aim',group:'er'},
 habiter:{de:'wohnen',stem:'habit',group:'er'},
 jouer:{de:'spielen',stem:'jou',group:'er'},
 chanter:{de:'singen',stem:'chant',group:'er'},
 regarder:{de:'anschauen',stem:'regard',group:'er'},
 ecouter:{inf:'écouter',de:'zuhören',stem:'écout',group:'er'},
 finir:{de:'beenden',stem:'fin',group:'ir'},
 choisir:{de:'wählen',stem:'chois',group:'ir'},
 attendre:{de:'warten',stem:'attend',group:'re'},
 repondre:{inf:'répondre',de:'antworten',stem:'répond',group:'re'},
 vendre:{de:'verkaufen',stem:'vend',group:'re'}
};
Object.keys(V).forEach(k=>{const v=V[k];v.key=k;if(!v.inf)v.inf=k;if(v.forms){v.irr=true}else{v.ends=GE[v.group];v.forms=v.ends.map(e=>v.stem+e)}});
export const UNITS=[
 {id:'etre',color:'#9B7BFF',title:'être',de:'sein · unregelmäßig',ic:'être',irr:true,verbs:['etre']},
 {id:'avoir',color:'#FF6B88',title:'avoir',de:'haben · unregelmäßig',ic:'avoir',irr:true,verbs:['avoir']},
 {id:'aller',color:'#3DD6B0',title:'aller',de:'gehen · unregelmäßig',ic:'aller',irr:true,verbs:['aller']},
 {id:'faire',color:'#4CC3F5',title:'faire',de:'machen · unregelmäßig',ic:'faire',irr:true,verbs:['faire']},
 {id:'er',color:'#FFC933',title:'Verben auf -er',de:'regelmäßig · parler, aimer, jouer …',ic:'-er',irr:false,verbs:['parler','aimer','habiter','jouer','chanter','regarder','ecouter']},
 {id:'irre',color:'#FF8AD0',title:'Verben auf -ir und -re',de:'regelmäßig · finir, attendre … (Bonus)',ic:'-ir',irr:false,verbs:['finir','choisir','attendre','repondre','vendre']}
];
export const RAW={
 etre:[['etre',0,'Je ___ à la maison.','Ich bin zu Hause.'],['etre',1,'Tu ___ mon meilleur ami.','Du bist mein bester Freund.'],['etre',2,'Elle ___ à Paris.','Sie ist in Paris.'],['etre',3,'Nous ___ en classe.','Wir sind im Klassenzimmer.'],['etre',4,'Vous ___ très gentils !','Ihr seid sehr nett!'],['etre',5,'Ils ___ au cinéma.','Sie sind im Kino.'],['etre',5,'Léa et Tom ___ amis.','Léa und Tom sind Freunde.'],['etre',2,'Mon frère ___ malade.','Mein Bruder ist krank.']],
 avoir:[['avoir',0,"J'___ un chien.",'Ich habe einen Hund.'],['avoir',1,'Tu ___ un frère ?','Hast du einen Bruder?'],['avoir',2,'Il ___ onze ans.','Er ist elf Jahre alt.'],['avoir',3,'Nous ___ cours de maths.','Wir haben Matheunterricht.'],['avoir',4,'Vous ___ faim ?','Habt ihr Hunger?'],['avoir',5,'Elles ___ une idée.','Sie haben eine Idee.'],['avoir',2,'Ma sœur ___ un vélo.','Meine Schwester hat ein Fahrrad.'],['avoir',5,'Mes parents ___ une voiture.','Meine Eltern haben ein Auto.']],
 aller:[['aller',0,"Je ___ à l'école.",'Ich gehe zur Schule.'],['aller',1,'Tu ___ à la piscine ?','Gehst du ins Schwimmbad?'],['aller',2,'Il ___ chez son ami.','Er geht zu seinem Freund.'],['aller',3,'Nous ___ au cinéma.','Wir gehen ins Kino.'],['aller',4,'Vous ___ à Berlin ?','Fahrt ihr nach Berlin?'],['aller',5,'Elles ___ à la maison.','Sie gehen nach Hause.'],['aller',2,'Ça ___ très bien !','Es geht mir sehr gut!'],['aller',5,'Mes amis ___ au parc.','Meine Freunde gehen in den Park.']],
 faire:[['faire',0,'Je ___ mes devoirs.','Ich mache meine Hausaufgaben.'],['faire',1,'Tu ___ du sport ?','Machst du Sport?'],['faire',2,'Elle ___ un gâteau.','Sie macht einen Kuchen.'],['faire',3,'Nous ___ du vélo.','Wir fahren Rad.'],['faire',4,'Vous ___ une pause ?','Macht ihr eine Pause?'],['faire',5,'Ils ___ la cuisine.','Sie kochen.'],['faire',2,"Il ___ beau aujourd'hui.",'Heute ist schönes Wetter.'],['faire',5,'Mes frères ___ du judo.','Meine Brüder machen Judo.']],
 er:[['parler',0,'Je ___ français.','Ich spreche Französisch.'],['aimer',1,'Tu ___ le chocolat.','Du magst Schokolade.'],['habiter',2,'Elle ___ à Munich.','Sie wohnt in München.'],['chanter',3,'Nous ___ une chanson.','Wir singen ein Lied.'],['regarder',4,'Vous ___ un film ?','Seht ihr einen Film an?'],['jouer',5,'Ils ___ au foot.','Sie spielen Fußball.'],['aimer',0,"J'___ la musique.",'Ich mag Musik.'],['ecouter',2,'Mon père ___ la radio.','Mein Vater hört Radio.']],
 irre:[['finir',0,'Je ___ mes devoirs à cinq heures.','Ich beende meine Hausaufgaben um fünf.'],['choisir',1,'Tu ___ un livre.','Du wählst ein Buch.'],['finir',2,'Le cours ___ à midi.','Der Unterricht endet um zwölf.'],['choisir',3,'Nous ___ un cadeau.','Wir wählen ein Geschenk.'],['finir',4,'Vous ___ bientôt ?','Seid ihr bald fertig?'],['finir',5,'Les élèves ___ le test.','Die Schüler beenden den Test.'],['attendre',0,"J'___ le bus.",'Ich warte auf den Bus.'],['repondre',1,'Tu ___ au professeur.','Du antwortest dem Lehrer.'],['attendre',2,'Il ___ son ami.','Er wartet auf seinen Freund.'],['vendre',3,'Nous ___ des livres.','Wir verkaufen Bücher.'],['repondre',4,'Vous ___ à la question.','Ihr antwortet auf die Frage.'],['attendre',5,'Elles ___ le train.','Sie warten auf den Zug.']]
};
export const SP={};
Object.keys(RAW).forEach(k=>{SP[k]=RAW[k].map((r,i)=>({id:k+i,v:V[r[0]],p:r[1],fr:r[2],de:r[3]}))});
export const TRAP={faire:{4:['faisez'],5:['faisent']},etre:{4:['êtez'],5:['êtent']},aller:{0:['alle'],5:['allent']},avoir:{2:['ha'],5:['avent']}};
export const HINT={
 etre:['je suis – Ich bin.','tu es – Du bist. Nur zwei Buchstaben: e-s.','il / elle / on est – Er, sie, man ist. Das gilt auch für Namen: Léa est …','nous sommes – Wir sind. Merke das doppelte m.','vous êtes – Ihr seid / Sie sind. Der Dach-Akzent ê ist Pflicht, „vous êtez“ gibt es nicht.','ils / elles sont – Sie sind. Alle Mehrzahl-Subjekte (Léa et Tom) brauchen sont.'],
 avoir:["j'ai – Ich habe. Vor einem Vokal wird je zu j'.",'tu as – Du hast.','il / elle / on a – Er, sie hat. Das Alter sagt man mit avoir: Il a onze ans.','nous avons – Wir haben.','vous avez – Ihr habt / Sie haben.','ils / elles ont – Sie haben (Mehrzahl).'],
 aller:['je vais – Ich gehe. Es heißt nicht „je vas“.','tu vas – Du gehst.','il / elle / on va – Er, sie geht. Nur zwei Buchstaben, kein s.','nous allons – Wir gehen. Hier taucht der Stamm all- wieder auf.','vous allez – Ihr geht / Sie gehen.','ils / elles vont – Sie gehen. Wie ils font und ils sont: Endung -ont.'],
 faire:['je fais – Ich mache.','tu fais – Du machst. Klingt und schreibt sich wie je fais.','il / elle / on fait – Er, sie macht. Hier steht ein t am Ende.','nous faisons – Wir machen.','vous faites – Ihr macht / Sie machen. Nicht „faisez“! Wie vous êtes eine Ausnahme auf -tes.','ils / elles font – Sie machen. Eine der vier -ont-Formen.']
};
export const TIPS={
 etre:[['Vier Verben, vier Mal -ont','Bei ils / elles enden alle vier Unregelmäßigen auf -ont: ils sont, ils ont, ils vont, ils font.'],['Akzent nicht vergessen','vous êtes mit Dach auf dem ê. Das ist eine der wenigen Ausnahmen auf -tes.'],['Mehrzahl heißt ils / elles','Léa et Tom sont amis. Zwei oder mehr Personen: immer die sont-Form.'],['Wofür brauchst du être?','Zustand, Herkunft, Beruf: Je suis fatigué. Il est prof. Nous sommes de Munich.']],
 avoir:[['Vor Vokal: j\'','j\'ai, nicht „je ai“. Das Gleiche gilt für j\'aime und j\'habite.'],['Alter mit avoir','Il a onze ans heißt wörtlich „Er hat elf Jahre“. Mit être wäre es falsch.'],['Hunger und Durst','avoir faim, avoir soif: Im Französischen „hat“ man Hunger.'],['Vier Verben, vier Mal -ont','ils ont, ils sont, ils vont, ils font.']],
 aller:[['Singular klingt anders','je vais, tu vas, il va: Die Formen sehen dem Infinitiv kaum ähnlich.'],['Plural kehrt zum Stamm zurück','nous allons, vous allez: Hier ist all- wieder da.'],['Wohin?','aller + à: Je vais à l\'école. Vor Städten und Orten immer à / au / à la.'],['Gruß-Klassiker','Comment ça va ? Ça va bien. Hier steckt aller drin.']],
 faire:[['Ausnahme auf -tes','vous faites, vous êtes: Keine Form auf -ez wie bei den regelmäßigen Verben.'],['Wetter','Il fait beau. Il fait froid. Wetter wird mit faire gebildet.'],['Sport und Haushalt','faire du sport, faire du vélo, faire les devoirs, faire la cuisine.'],['Vier Verben, vier Mal -ont','ils font, ils sont, ils ont, ils vont.']],
 er:[['Stamm bestimmen','Infinitiv ohne -er: parler wird zu parl-. Dann kommt die Endung dran.'],['Sechs Endungen','-e, -es, -e, -ons, -ez, -ent. Sie bleiben bei allen Verben auf -er gleich.'],['Hören und Schreiben','je parle, tu parles, il parle und ils parlent klingen gleich. Die Endungen hört man nicht, du musst sie schreiben.'],['Vor Vokal: j\'','j\'aime, j\'habite, j\'écoute: je wird vor Vokal und stummem h zu j\'.']],
 irre:[['Verben auf -ir','Im Plural kommt -iss- dazu: nous finissons, vous finissez, ils finissent.'],['Verben auf -re','Bei il / elle / on gibt es keine Endung: il attend. Das d bleibt stehen.'],['Gleich bei allen','nous endet immer auf -ons, vous immer auf -ez.'],['Typische Verben','finir, choisir, attendre, répondre, vendre. Lerne den Stamm, dann sitzen die Endungen.']]
};
