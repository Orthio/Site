//Global var used in both functions
let currentCharacter = {};
let resultsHistory = [];
let nameArray = [];
let clanArray = [];

let raceType = "Random";
let sexType = "Random";

let flawText = "";
let voiceText = "";

let races = new
  Array(200).fill("Human")
  .concat(new Array(40).fill("Dwarf"))
  .concat(new Array(40).fill("Elf"))
  .concat(new Array(40).fill("Half-Orc"))
  .concat(new Array(40).fill("Gnome"))
  .concat(new Array(40).fill("Tiefling"))
  .concat(new Array(10).fill("Halfling"))
  .concat(new Array(6).fill("Half-Elf"))
  .concat(new Array(4).fill("Kobold"))
  .concat(new Array(9).fill("Tabaxi"))
  .concat(new Array(7).fill("Harengon"))
  .concat(new Array(9).fill("Aarakocra"))
  .concat(new Array(10).fill("Kenku"))
  .concat(new Array(8).fill("Mousefolk"))
  .concat(new Array(2).fill("Firbolg"))
  .concat(new Array(2).fill("Githyanki"))
  .concat(new Array(2).fill("Githzerai"))
  .concat(["Genasi", "Lizardfolk",
    "Yuan-Ti", "Tortle", "Centaur", "Minotaur", "Shifter", "Changeling", "Aasimar"]);

const sexes = ["Male", "Female"];

// #region Name Listing Region

const nameListings = {
  HumanFemaleNames: [
    "Glouris", "Maeve", "Sevaera", "Xaemarra", "Zraela", "Aisha", "Farah", "Nura", "Rashida", "Zalebyeh", "Atala", "Ceidil", "Hama", "Jasmal", "Meilil", "Seipora", "Yasheira", "Zasheida", "Arveene", "Esvele", "Jhessail", "Kerri", "Lureene", "Miri", "Rowan", "Shandri", "Tessele", "Alethra", "Kara", "Katernin", "Mara", "Natali", "Olma", "Tana", "Zora", "Alicia", "Gennifer", "Meridith", "Elaine", "Olivia", "Varra", "Ulmarra", "Imza", "Navarra", "Yuldra", "Aithe", "Chalan", "Oloma", "Phaele", "Sarade", "Amafrey", "Betha", "Cefrey", "Kethra", "Mara", "Olga", "Silifrey", "Westra", "Apret", "Bask", "Fanul", "Mokat", "Nismet", "Ril", "Arizima", "Chathi", "Nephis", "Nulara", "Murithi", "Sefris", "Thola", "Umara", "Zolis", "Anva", "Dasha", "Dima", "Olga", "Westra", "Zlatara", "Fyevarra", "Hulmarra", "Immith", "Imzel", "Navarra", "Shevarra", "Tammith", "Yuldra", "Anet", "Bes", "Idim", "Lenet", "Moqem", "Neghet", "Sihvet", "Bai", "Chao", "Jia", "Lei", "Mei", "Qiao", "Shui", "Tai", "Bolormaa", "Bortai", "Erdene", "Naran", "Ulutiun", "Balama", "Dona", "Faila", "Jalana", "Luisa", "Marta", "Quara", "Selise", "Vonda", "Akna", "Chena", "Kaya", "Sedna", "Ublereak", "Aaliyah", "Aida", "Akilah", "Alia", "Amina", "Atefeh", "Chaima", "Dalia", "Ehsan", "Elham", "Farah", "Fatemah", "Gamila", "Iesha", "Inbar", "Kamaria", "Khadija", "Layla", "Lupe", "Nabila", "Nadine", "Naima", "Najila", "Najwa", "Nakia", "Nashwa", "Nawra", "Nuha", "Nura", "Oma", "Qadira", "Qamar", "Qistina", "Rahima", "Rihanna", "Saadia", "Sabah", "Sada", "Saffron", "Sahar", "Salma", "Shatha", "Tahira", "Takisha", "Thana", "Yadira", "Zahra", "Zaida", "Zaina", "Zeinab", "Aife", "Aina", "Alane", "Ardena", "Arienh", "Beatha", "Birgit", "Briann", "Caomh", "Cara", "Cinnia", "Cordelia", "Deheune", "Divone", "Donia", "Doreena", "Elsha", "Enid", "Ethne", "Evelina", "Fianna", "Genevieve", "Gilda", "Gitta", "Grania", "Gwyndolin", "Idelisa", "Isolde", "Keelin", "Kennocha", "Lavena", "Lesley", "Linnette", "Lyonesse", "Mabina", "Marvina", "Mavis", "Mima", "Morgan", "Muriel", "Nareena", "Oriana", "Regan", "Ronat", "Rowena", "Selma", "Ula", "Venetia", "Wynne", "Yseult", "Ai", "Anming", "Baozhai", "Bei", "Caixia", "Changchang", "Chen", "Chou", "Chunhua", "Daianna", "Daiyu", "Die", "Ehuang", "Fenfang", "Ge", "Hong", "Huan", "Huifang", "Jia", "Jiao", "Jiaying", "Jingfei", "Jinjing", "Lan", "Li", "Lihua", "Lin", "Ling", "Liu", "Meili", "Ning", "Qi", "Qiao", "Rong", "Shu", "Shuang", "Song", "Ting", "Wen", "Xia", "Xiaodan", "Xiaoli", "Xingjuan", "Xue", "Ya", "Yan", "Ying", "Yuan", "Yue", "Yun", "A'at", "Ahset", "Amunet", "Aneski", "Atet", "Baketamon", "Betrest", "Bunefer", "Dedyet", "Hatshepsut", "Hentie", "Herit", "Hetepheres", "Intakaes", "Ipwet", "Itet", "Joba", "Kasmut", "Kemanub", "Khemut", "Kiya", "Maia", "Menhet", "Merit", "Meritamen", "Merneith", "Merseger", "Muyet", "Nebet", "Nebetah", "Nedjemmut", "Nefertiti", "Neferu", "Neithotep", "Nit", "Nofret", "Nubemiunu", "Peseshet", "Pypuy", "Qalhata", "Rai", "Redji", "Sadeh", "Sadek", "Sitamun", "Sitre", "Takhat", "Tarset", "Taweret", "Werenro", "Adelaide", "Agatha", "Agnes", "Aline", "Avelina", "Avice", "Cecily", "Egelina", "Eloise", "Elysande", "Emeny", "Emma", "Emmeline", "Ermina", "Eva", "Galiena", "Geva", "Giselle", "Griselda", "Hadwisa", "Herleva", "Hugolina", "Ida", "Margery", "Maynild", "Millicent", "Oriel", "Rohesia", "Rosalind", "Rosamund", "Sybil", "Williamina", "Yvonne", "Aalis", "Agatha", "Agnez", "Alberea", "Alips", "Amee", "Amelot", "Avelina", "Blancha", "Cateline", "Cecilia", "Claricia", "Collette", "Denisete", "Dorian", "Edelina", "Emelina", "Emmelot", "Ermentrudis", "Gibelina", "Gila", "Gillette", "Guiburgis", "Guillemette", "Guoite", "Hecelina", "Heloysis", "Helyoudis", "Hodeardis", "Isabellis", "Jaquette", "Jehan", "Johanna", "Juliote", "Katerine", "Luciana", "Margot", "Marguerite", "Maria", "Melisende", "Odelina", "Perrette", "Petronilla", "Sedilia", "Stephana", "Sybilla", "Ysabeau", "Ysabel", "Adelhayt", "Affra", "Agatha", "Allet", "Angnes", "Anna", "Apell", "Applonia", "Barbara", "Brida", "Brigita", "Cecilia", "Clara", "Cristina", "Dorothea", "Duretta", "Els", "Elsbeth", "Engel", "Enlein", "Enndlin", "Eva", "Fela", "Fronicka", "Genefe", "Geras", "Gerhauss", "Gertrudt", "Guttel", "Helena", "Irmel", "Jonata", "Katerina", "Kuen", "Kungund", "Lucia", "Madalena", "Magdalen", "Marlein", "Martha", "Otilia", "Ottilg", "Peternella", "Reusin", "Sibilla", "Ursel", "Vrsula", "Walpurg", "Acantha", "Aella", "Alektos", "Alkippe", "Andromeda", "Antigone", "Ariadne", "Astraea", "Chloros", "Chryseos", "Daphne", "Despoina", "Dione", "Eileithyia", "Elektra", "Euadne", "Eudora", "Eunomia", "Hekabe", "Helene", "Hermoione", "Hippolyte", "Ianthe", "Iokaste", "Iole", "Iphigenia", "Ismene", "Kalliope", "Kallisto", "Kalypso", "Karme", "Kassandra", "Kassiopeia", "Kirke", "Kleio", "Klotho", "Klytie", "Kynthia", "Leto", "Megaera", "Melaina", "Melpomene", "Nausikaa", "Nemesis", "Niobe", "Ourania", "Phaenna", "Polymnia", "Semele", "Theia", "Abha", "Aishwarya", "Amala", "Ananda", "Ankita", "Archana", "Avani", "Chandana", "Chandrakanta", "Chetan", "Darshana", "Devi", "Dipti", "Esha", "Gauro", "Gita", "Indira", "Indu", "Jaya", "Kala", "Kalpana", "Kamala", "Kanta", "Kashi", "Kishori", "Lalita", "Lina", "Madhur", "Manju", "Meera", "Mohana", "Mukta", "Nisha", "Nitya", "Padma", "Pratima", "Priya", "Rani", "Sarala", "Shakti", "Shanta", "Shobha", "Sima", "Sonal", "Sumana", "Sunita", "Tara", "Valli", "Vijaya", "Vimala", "Aika", "Akemi", "Akiko", "Amaya", "Asami", "Ayumi", "Bunko", "Chieko", "Chika", "Chiyo", "Cho", "Eiko", "Emiko", "Eri", "Etsuko", "Gina", "Hana", "Haruki", "Hideko", "Hikari", "Hiroko", "Hisoka", "Hishi", "Hotaru", "Izumi", "Kameyo", "Kasumi", "Kimiko", "Kotone", "Kyoko", "Maiko", "Masako", "Mi", "Minori", "Mizuki", "Naoki", "Natsuko", "Noriko", "Rei", "Ren", "Saki", "Shigeko", "Shinju", "Sumiko", "Toshiko", "Tsukiko", "Ume", "Usagi", "Yasuko", "Yuriko", "Ahuiliztli", "Atl", "Eluia", "Eztli", "Ichtaca", "Izel", "Mecatl", "Meztli", "Nahuatl", "Necahual", "Nenetl", "Nochtli", "Papan", "Patli", "Sacnite", "Teicui", "Tepin", "Teuicui", "Teyacapan", "Tlaco", "Abebi", "Abena", "Abimbola", "Akoko", "Akachi", "Alaba", "Anuli", "Ayo", "Bolanle", "Bosede", "Chiamaka", "Chidi", "Chidimma", "Chinyere", "Chioma", "Dada", "Ebele", "Efemena", "Ejiro", "Ekundayo", "Enitan", "Funanya", "Ifunanya", "Ige", "Ime", "Kunto", "Lesedi", "Lumusi", "Mojisola", "Monifa", "Nakato", "Ndidi", "Ngozi", "Nkiruka", "Nneka", "Ogechi", "Olamide", "Oluchi", "Omolara", "Onyeka", "Simisola", "Temitope", "Thema", "Titlayo", "Udo", "Uduak", "Ufuoma", "Yaa", "Yejide", "Yewande", "Alfhild", "Arnbjorg", "Ase", "Aslog", "Astrid", "Auda", "Audhid", "Bergljot", "Birghild", "Bodil", "Brenna", "Brynhild", "Dagmar", "Eerika", "Eira", "Gudrun", "Gunborg", "Gunhild", "Gunvor", "Helga", "Hertha", "Hilde", "Hillevi", "Ingrid", "Iona", "Jorunn", "Kari", "Kenna", "Magnhild", "Nanna", "Olga", "Ragna", "Ragnhild", "Ranveig", "Runa", "Saga", "Sigfrid", "Signe", "Sigrid", "Sigwjnn", "Solveg", "Svanhild", "Thora", "Torborg", "Torunn", "Tove", "Unn", "Vigdis", "Ylva", "Yngvild", "Ahulani", "Airini", "Alani", "Aluala", "Anahera", "Anuhea", "Aolani", "Elenoa", "Emele", "Fetia", "Fiva", "Halona", "Hi'ilei", "Hina", "Hinatea", "Huali", "Inia", "Inina", "Iolani", "Isa", "Ka'ana'ana", "Ka'ena", "Kaamia", "Kahula", "Kailani", "Kamaile", "Kamakani", "Kamea", "Latai", "Liona", "Lokelani", "Marva", "Mehana", "Millawa", "Moana", "Ngana", "Nohea", "Pelika", "Sanoe", "Satina", "Tahia", "Tasi", "Tiaho", "Tihani", "Toroa", "Ulanni", "Uluwehi", "Vaina", "Waiola", "Waitara", "Aelia", "Aemilia", "Agrippina", "Alba", "Antonia", "Aquila", "Augusta", "Aurelia", "Balbina", "Blandina", "Caelia", "Camilla", "Casia", "Claudia", "Cloelia", "Domitia", "Drusa", "Fabia", "Fabricia", "Fausta", "Flavia", "Floriana", "Fulvia", "Germana", "Glaucia", "Gratiana", "Hadriana", "Hermina", "Horatia", "Hortensia", "Iovita", "Iulia", "Laelia", "Laurentia", "Livia", "Longina", "Lucilla", "Lucretia", "Marcella", "Marcia", "Maxima", "Nona", "Octavia", "Paulina", "Petronia", "Porcia", "Tacita", "Tullia", "Verginia", "Vita", "Agripina", "Anastasiya", "Bogdana", "Boleslava", "Bozhena", "Danica", "Darya", "Desislava", "Dragoslava", "Dunja", "Efrosinia", "Ekaterina", "Elena", "Faina", "Galina", "Irina", "Iskra", "Jasna", "Katarina", "Katya", "Kresimira", "Lyudmila", "Magda", "Mariya", "Militsa", "Miloslava", "Mira", "Miroslava", "Mokosh", "Morana", "Natasha", "Nika", "Olga", "Rada", "Radoslava", "Raisa", "Slavitsa", "Sofiya", "Stanislava", "Svetlana", "Tatyana", "Tomislava", "Veronika", "Vesna", "Vladimira", "Yaroslava", "Yelena", "Zaria", "Zarya", "Zoria", "Abella", "Adalina", "Adora", "Adriana", "Ana", "Antonia", "Basilia", "Beatriz", "Bonita", "Camila", "Cande", "Carmen", "Catlina", "Dolores", "Dominga", "Dorotea", "Elena", "Elicia", "Esmerelda", "Felipina", "Francisca", "Gabriela", "Imelda", "Ines", "Isabel", "Juana", "Leocadia", "Leonor", "Leta", "Lucinda", "Maresol", "Maria", "Maricela", "Matilde", "Melania", "Monica", "Neva", "Nilda", "Petrona", "Rafaela", "Ramira", "Rosario", "Sofia", "Suelo", "Teresa", "Tomasa", "Valentia", "Veronica", "Ynes", "Ysabel"
  ],
  HumanMaleNames: [
    "Houn", "Rhivaun", "Umbril", "Xaemar", "Zeltaebar", "Aali", "Rashid", "Tahnon", "Tanzim", "Whalide", "Aseir", "Bardeid", "Haseid", "Khemed", "Mehmen", "Sudeiman", "Zasheir", "Darvin", "Dorn", "Evendur", "Gorstag", "Grim", "Helm", "Malark", "Morn", "Randal", "Stedd", "Bor", "Fodel", "Glar", "Grigor", "Igan", "Ivor", "Kosef", "Mival", "Orel", "Pavel", "Sergor", "Artur", "Bern", "Colin", "Manfred", "Tristan", "Boriv", "Gardar", "Madevik", "Vlad", "Aldym", "Chand", "Meleghost", "Presmer", "Sandrue", "Uregaunt", "Ander", "Blath", "Bran", "Frath", "Geth", "Lander", "Luth", "Malcer", "Stor", "Taman", "Urth", "Charva", "Duma", "Hukir", "Jama", "Pradir", "Sikhil", "Aoth", "Bareris", "Ehput-Ki", "Kethoth", "Mumed", "Ramas", "So-Kehur", "Thazar-De", "Urhur", "Avan", "Ostaram", "Petro", "Stor", "Taman", "Thalaman", "Urth", "Borivik", "Faurgar", "Jandar", "Kanithar", "Madislak", "Ralmevik", "Shaumar", "Vladislak", "Awar", "Cohis", "Damota", "Gewar", "Hapah", "Laskaw", "Senesaw", "Tokhis", "An", "Chen", "Chi", "Fai", "Jiang", "Jun", "Lian", "Long", "Meng", "On", "Shan", "Shui", "Wen", "Atlan", "Bayar", "Chingis", "Chinua", "Mongke", "Temur", "Amak", "Chu", "Imnek", "Kanut", "Siku", "Abbad", "Abdul", "Achmed", "Akeem", "Alif", "Amir", "Asim", "Bashir", "Bassam", "Fahim", "Farid", "Farouk", "Fayez", "Fayyaad", "Fazil", "Hakim", "Halil", "Hamid", "Hazim", "Heydar", "Hussein", "Jabari", "Jafar", "Jahid", "Jamal", "Kalim", "Karim", "Kazim", "Khadim", "Khalid", "Mahmud", "Mansour", "Musharraf", "Mustafa", "Nadir", "Nazim", "Omar", "Qadir", "Qusay", "Rafiq", "Rakim", "Rashad", "Rauf", "Saladin", "Sami", "Samir", "Talib", "Tamir", "Tariq", "Yazid", "Airell", "Airic", "Alan", "Anghus", "Aodh", "Bardon", "Bearacb", "Bevyn", "Boden", "Bran", "Brasil", "Bredon", "Brian", "Bricriu", "Bryant", "Cadman", "Caradoc", "Cedric", "Conalt", "Conchobar", "Condon", "Darcy", "Devin", "Dillion", "Donaghy", "Donall", "Duer", "Eghan", "Ewyn", "Ferghus", "Galvyn", "Gildas", "Guy", "Harvey", "Iden", "Irven", "Karney", "Kayne", "Kelvyn", "Kunsgnos", "Leigh", "Maccus", "Moryn", "Neale", "Owyn", "Pryderi", "Reaghan", "Taliesin", "Tiernay", "Turi", "Bingwen", "Bo", "Bolin", "Chang", "Chao", "Chen", "Cheng", "Da", "Dingxiang", "Fang", "Feng", "Fu", "Gang", "Guang", "Hai", "Heng", "Hong", "Huan", "Huang", "Huiliang", "Huizhong", "Jian", "Jiayi", "Junjie", "Kang", "Lei", "Liang", "Ling", "Liwei", "Meilin", "Niu", "Peizhi", "Peng", "Ping", "Qiang", "Qiu", "Quan", "Renshu", "Rong", "Ru", "Shan", "Shen", "Tengfei", "Wei", "Xiaobo", "Xiaoli", "Xin", "Yang", "Ying", "Zhong", "Ahmose", "Akhoim", "Amasis", "Amenemhet", "Anen", "Banefre", "Bek", "Djedefre", "Djoser", "Hekaib", "Henenu", "Horemheb", "Horwedja", "Huya", "Ibebi", "Idu", "Imhotep", "Ineni", "Ipuki", "Irsu", "Kagemni", "Kawab", "Kenamon", "Kewap", "Khaemwaset", "Khafra", "Khusebek", "Masaharta", "Meketre", "Menkhaf", "Merenre", "Metjen", "Nebamun", "Nebetka", "Nehi", "Nekure", "Nessumontu", "Pakhom", "Pawah", "Pawero", "Ramose", "Rudjek", "Sabaf", "Sebek-khu", "Sebni", "Senusret", "Shabaka", "Somintu", "Thaneni", "Thethi", "Ambroys", "Ame", "Andri", "Andriet", "Anthoine", "Bernard", "Charles", "Chariot", "Colin", "Denis", "Durant", "Edouart", "Eremon", "Ernault", "Ethor", "Felix", "Floquart", "Galleren", "Gaultier", "Gilles", "Guy", "Henry", "Hugo", "Imbert", "Jacques", "Jacquot", "Jean", "Jehannin", "Louis", "Louys", "Loys", "Martin", "Michel", "Mille", "Morelet", "Nicolas", "Nicolle", "Oudart", "Perrin", "Phillippe", "Pierre", "Regnault", "Richart", "Robert", "Robinet", "Sauvage", "Simon", "Talbot", "Tanguy", "Vincent", "Albrecht", "Allexander", "Baltasar", "Benedick", "Berhart", "Caspar", "Clas", "Cristin", "Cristoff", "Dieterich", "Engelhart", "Erhart", "Felix", "Frantz", "Fritz", "Gerhart", "Gotleib", "Hans", "Hartmann", "Heintz", "Herman", "Jacob", "Jeremias", "Jorg", "Karll", "Kilian", "Linhart", "Lorentz", "Ludwig", "Marx", "Melchor", "Mertin", "Michel", "Moritz", "Osswald", "Ott", "Peter", "RudolfF", "Ruprecht", "Sewastian", "Sigmund", "Steffan", "Symon", "Thoman", "Ulrich", "Vallentin", "Wendel", "Wilhelm", "Wolff", "Wolfgang", "Adonis", "Adrastos", "Aeson", "Aias", "Aineias", "Aiolos", "Alekto", "Alkeides", "Argos", "Brontes", "Damazo", "Dardanos", "Deimos", "Diomedes", "Endymion", "Epimetheus", "Erebos", "Euandros", "Ganymedes", "Glaukos", "Hektor", "Heros", "Hippolytos", "Iacchus", "Iason", "Kadmos", "Kastor", "Kephalos", "Kepheus", "Koios", "Kreios", "Laios", "Leandros", "Linos", "Lykos", "Melanthios", "Menelaus", "Mentor", "Neoptolemus", "Okeanos", "Orestes", "Pallas", "Patroklos", "Philandros", "Phoibos", "Phrixus", "Priamos", "Pyrrhos", "Xanthos", "Zephyros", "Abhay", "Ahsan", "Ajay", "Ajit", "Akhil", "Amar", "Amit", "Ananta", "Aseem", "Ashok", "Bahadur", "Basu", "Chand", "Chandra", "Damodar", "Darhsan", "Devdan", "Dinesh", "Dipak", "Gopal", "Govind", "Harendra", "Harsha", "Ila", "Isha", "Johar", "Kalyan", "Kiran", "Kumar", "Lakshmana", "Mahavir", "Narayan", "Naveen", "Nirav", "Prabhakar", "Prasanna", "Raghu", "Rajanikant", "Rakesh", "Ranjeet", "Rishi", "Sanjay", "Sekar", "Shandar", "Sumantra", "Vijay", "Vikram", "Vimal", "Vishal", "Yash", "Akio", "Atsushi", "Daichi", "Daiki", "Daisuke", "Eiji", "Fumio", "Hajime", "Haru", "Hideaki", "Hideo", "Hikaru", "Hiro", "Hiroki", "Hisao", "Hitoshi", "Isamu", "Isao", "Jun", "Katashi", "Katsu", "Kei", "Ken", "Kenshin", "Kenta", "Kioshi", "Makoto", "Mamoru", "Masato", "Masumi", "Noboru", "Norio", "Osamu", "Ryota", "Sadao", "Satoshi", "Shigeo", "Shin", "Sora", "Tadao", "Takehiko", "Takeo", "Takeshi", "Takumi", "Tamotsu", "Tatsuo", "Toru", "Toshio", "Yasio", "Yukio", "Abebe", "Abel", "Abidemi", "Abrafo", "Adisa", "Amadi", "Amara", "Anyim", "Azubuike", "Bapoto", "Baraka", "Bohlale", "Bongani", "Bujune", "Buziba", "Chakide", "Chibuzo", "Chika", "Chimola", "Chiratidzo", "Dabulamanzi", "Dumisa", "Dwanh", "Emeka", "Folami", "Gatura", "Gebhuza", "Gero", "Isoba", "Kagiso", "Kamau", "Katlego", "Masego", "Matata", "Nthanda", "Ogechi", "Olwenyo", "Osumare", "Paki", "Qinisela", "Quanda", "Samanya", "Shanika", "Sibonakaliso", "Tapiwa", "Thabo", "Themba", "Uzoma", "Zuberi", "Zuri", "Agni", "Alaric", "Anvindr", "Arvid", "Asger", "Asmund", "Bjarte", "Bjorg", "Bjorn", "Brandr", "Brandt", "Brynjar", "Calder", "Colborn", "Cuyler", "Egil", "Einar", "Eric", "Erland", "Fiske", "Folkvar", "Fritjof", "Frode", "Geir", "Halvar", "Hemming", "Hjalmar", "Hjortr", "Ingimarr", "Ivar", "Knud", "Leif", "Liufr", "Manning", "Oddr", "Olin", "Ormr", "Ove", "Rannulfr", "Sigurd", "Skari", "Snorri", "Sten", "Stigandr", "Stigr", "Sven", "Trygve", "Ulf", "Vali", "Vidar", "Afa", "Ahohako", "Aisake", "Aleki", "Anewa", "Anitelu", "Aputi", "Ariki", "Butat", "Enele", "Fef", "Fuifui", "Ha'aheo", "Hanohano", "Haunui", "Hekili", "Hiapo", "Hikawera", "Hanano", "Ho'onani", "Hoku", "Hu'eu", "Ina", "Itu", "Ka'aukai", "Ka'eo", "Kaelani", "Kahale", "Kaiea", "Kaikoa", "Kana'l", "Koamalu", "Ka", "Laki", "Makai", "Manu", "Manuka", "Nui", "Pono", "Popoki", "Ruru", "Tahu", "Taurau", "Tuala", "Turoa", "Tusitala", "Uaine", "Waata", "Waipuna", "Zamar", "Alexandre", "Alfonso", "Alonso", "Anthon", "Arcos", "Arnaut", "Arturo", "Bartoleme", "Benito", "Bernat", "Blasco", "Carlos", "Damian", "Diego", "Domingo", "Enrique", "Escobar", "Ettor", "Fernando", "Franciso", "Gabriel", "Garcia", "Gaspar", "Gil", "Gomes", "Goncalo", "Gostantin", "Jayme", "Joan", "Jorge", "Jose", "Juan", "Machin", "Martin", "Mateu", "Miguel", "Nicolas", "Pascual", "Pedro", "Porico", "Ramiro", "Ramon", "Rodrigo", "Sabastian", "Salvador", "Simon", "Tomas", "Tristan", "Valeriano", "Ynigo"
  ],

  HumanClanNames: [
    "Lharaendo", "Mristar", "Wyndael", "Alaii", "Bordjia", "Clelarra", "Desai", "Dakawa", "Dursalai", "Goldor", "Iriphawa", "Kellordrai", "Lalajar", "Qahtan", "Yethtai", "Zazalaar", "Basha", "Dumein", "Jassan", "Khalid", "Mostana", "Pashar", "Rein", "Amblecrown", "Buckman", "Dundragon", "Evenwood", "Greycastle", "Tallstag", "Bersk", "Chernin", "Dotsk", "Kulenov", "Marsk", "Nemetsk", "Shemov", "Starag", "Archer", "Gareth", "Leed", "Kendrick", "Morgan", "Waters", "Chergoba", "Drazlad", "Tazyara", "Vargoba", "Stayankina", "Brightwood", "Helder", "Hornraven", "Lackman", "Stormwind", "Windrivver", "Datharathi", "Melpurvatta", "Nalambar", "Tiliputakas", "Ankhalab", "Anskuld", "Fezim", "Hahpet", "Nathandem", "Sepret", "Uuthrakt", "Chergoba", "Dyernina", "Iltazyara", "Murnyethara", "Stayanoga", "Ulmokina", "Cor", "Marak", "Laumee", "Harr", "Moq", "Qo", "Harr", "Woraw", "Tarak", "Chien", "Huang", "Kao", "Kung", "Lao", "Ling", "Mei", "Pin", "Shin", "Sum", "Tan", "Wan", "Atlan", "Bayar", "Chingis", "Chinua", "Mongke", "Temur", "Agosto", "Astorio", "Calabra", "Domine", "Falone", "Marivaldi", "Pisacar", "Ramondo", "Amak", "Chu", "Imnek", "Kanut", "Siku", "al-Kaabi", "Aileanach", "Barrach", "Beitean", "Càidh", "Dalais", "Druimein", "Foirbeis", "Flimean", "Guaire", "Guinne", "Munna", "Paorach", "Seagha", "Tuairnear", "Umphraidh", "Duàn", "Hao", "Jin", "Shèng", "Akila", "Aziza", "Bahiti", "Banafrit", "Chione", "Djeserit", "Eshe", "Hasina", "Mosi", "Tale", "Salama", "Abasi", "Adio", "Akiiki", "Baruti", "Chenzira", "Donkor", "Jumoke", "Idogbe", "Hondo", "Hanif", "Ngozi", "Alder", "Berry", "Croft", "Gorsuch", "Freeman", "Forrest", "Greeves", "Brook", "Heather", "Holt", "Keats", "Lea", "Marshal", "Cadiot", "Ciraisse", "Lucast", "Perrechon", "Rengault", "Quilletau", "Poucin", "Veaser", "Seramet", "Wateure", "Rivier", "Gilleberty", "Herbelot", "Cappus", "Rufflin", "Schawch", "Steller", "Schycker", "Veste", "Weyck", "Zech", "Zika", "Zervas", "Toles", "Rubis", "Vassos", "Neeru", "Lata", "Madan", "Soni", "Uddin", "Abe", "Maeda", "Sugiyama", "Ohno", "Tlapa", "Ehecatl", "Jaja", "Ezekwesili", "Okonjo", "Yar-Adua", "Inn", "Ánauðgi", "Bægifótr", "Feilan", "Fullspakr", "Galinn", "Harðfari", "Kuggi", "Kaða", "Skáld", "Styggr", "Tiorvi", "Tálkni", "Var", "Vífill", "Dainggati", "Yasawa", "Serevi", "Reihana", "Nakaunicina", "Maikelekelevesi", "Kini", "Kanani", "Ipo", "Mala", "Ulani", "Wana'ao", "Anuenue", "Pawakaho", "Pakeka", "Parepupuhi", "Pohomare", "Iahaukina", "Huapia", "Hauraki", "Ewe", "Hae", "Latu", "Olopoto", "Latu", "Paea", "Bursio", "Capitolinus", "Iunianus", "Rullianus", "Hnilo", "Semenov", "Kowacewicz", "Peña", "Márquez", "Nieto",
  ],

  DwarfFemaleNames: [
    "Anbera", "Artin", "Audhild", "Balifra", "Barbena", "Bardryn", "Bolhild", "Dagnal", "Dariff", "Delre", "Diesa", "Eldeth", "Eridred", "Falkrunn", "Fallthra", "Finellen", "Gillydd", "Gunnloda", "Gurdis", "Helgret", "Helja", "Hlin", "Ilde", "Jarana", "Kathra", "Kilia", "Kristryd", "Liftrasa", "Marastyr", "Mardred", "Morana", "Nalaed", "Nora", "Nurkara", "Oriff", "Ovina", "Riswynn", "Sannl", "Therlin", "Thodris", "Torbera", "Tordrid", "Torgga", "Urshar", "Valida", "Vistra", "Vonana", "Werydd", "Whurdred", "Yurgunn"
  ],

  DwarfMaleNames: [
    "Adrik", "Alberich", "Baern", "Barendd", "Beloril", "Brottor", "Dain", "Dalgal", "Darrak", "Delg", "Duergath", "Dworic", "Eberk", "Einkil", "Elaim", "Erias", "Fallond", "Fargrim", "Gardain", "Gilthur", "Gimgen", "Gimurt", "Harbek", "Kildrak", "Kilvar", "Morgran", "Morkral", "Nalral", "Nordak", "Nuraval", "Oloric", "Olunt", "Orsik", "Oskar", "Rangrim", "Reirak", "Rurik", "Taklinn", "Thoradin", "Thorin", "Thradal", "Tordek", "Traubon", "Travok", "Ulfgar", "Uraim", "Veit", "Vonbin", "Vondal", "Whurbin"
  ],


  DwarfClanNames: [
    "Aranore", "Balderk", "Battlehammer", "Bigtoe", "Bloodkith", "Bofdann", "Brawnanvil", "Brazzik", "Broodfist", "Burrowfound", "Caebrek", "Daerdahk", "Dankil", "Daraln", "Deepdelver", "Durthane", "Eversharp", "Fallack", "Fireforge", "Foamtankard", "Frostbeard", "Glanhig", "Goblinbane", "Goldfinder", "Gorunn", "Graybeard", "Hammerstone", "Helcral", "Holderhek", "Ironfist", "Loderr", "Lutgehr", "Morigak", "Orcfoe", "Rakankrak", "Ruby-Eye", "Rumnaheim", "Silveraxe", "Silverstone", "Steelfist", "Stoutale", "Strakeln", "Strongheart", "Thrahak", "Torevir", "Torunn", "Trollbleeder", "Trueanvil", "Trueblood", "Ungart"
  ],

  ElfFemaleNames: [
    "Adrie", "Ahinar", "Althaea", "Anastrianna", "Andraste", "Antinua", "Arara", "Baelitae", "Bethrynna", "Birel", "Caelynn", "Chaedi", "Claira", "Dara", "Drusilia", "Elama", "Enna", "Faral", "Felosial", "Hatae", "Ielenia", "Ilanis", "Irann", "Jarsali", "Jelenneth", "Keyleth", "Leshanna", "Lia", "Maiathah", "Malquis", "Meriele", "Mialee", "Myathethin", "Naivara", "Quelenna", "Quillathe", "Ridaro", "Sariel", "Shanairra", "Shava", "Silaqui", "Summes", "Theirastra", "Thiala", "Tiaathque", "Traulam", "Vadania", "Valanthe", "Valna", "Xanaphia"
  ],

  ElfMaleNames: [
    "Adran", "Aelar", "Aerdeth", "Ahvain", "Aramil", "Arannis", "Aust", "Azaki", "Beiro", "Berrian", "Caeldrim", "Carric", "Dayereth", "Dreali", "Efferil", "Eiravel", "Enialis", "Erdan", "Erevan", "Fivin", "Galinndan", "Gennal", "Hadarai", "Halimath", "Heian", "Himo", "Immeral", "Ivellios", "Korfel", "Lamlis", "Laucian", "Lucan", "Mindartis", "Naal", "Nutae", "Paelias", "Peren", "Quarion", "Riardon", "Rolen", "Soveliss", "Suhnae", "Thamior", "Tharivol", "Theren", "Theriatis", "Thervan", "Uthemar", "Vanuath", "Varis"
  ],

  ElfClanNames: [
    "Aloro", "Amakiir", "Amastacia", "Ariessus", "Aruanna", "Berevan", "Caerdonel", "Caphaxath", "Casilltenirra", "Cithreth", "Dalanthan", "Eathalena", "Erenaeth", "Ethanasath", "Fasharash", "Firahel", "Floshem", "Galanodel", "Goltorah", "Hanali", "Holimion", "Horineth", "Iathrana", "Ilphelkiir", "Iranapha", "Koehlanna", "Lathalas", "Liadon", "Meliamne", "Mellerelel", "Mystralath", "Naïlo", "Netyoive", "Ofandrus", "Ostoroth", "Othronus", "Qualanthri", "Raethran", "Rothenel", "Selevarun", "Siannodel", "Suithrasas", "Sylvaranth", "Teinithra", "Tiltathana", "Wasanthi", "Withrethin", "Xiloscient", "Xistsrith", "Yaeldrin"
  ],

  GnomeFemaleNames: [
    "Abalaba", "Bimpnottin", "Breena", "Buvvie", "Callybon", "Caramip", "Carlin", "Cumpen", "Dalaba", "Donella", "Duvamil", "Ella", "Ellyjoybell", "Ellywick", "Enidda", "Lilli", "Loopmottin", "Lorilla", "Luthra", "Mardnab", "Meena", "Menny", "Mumpena", "Nissa", "Numba", "Nyx", "Oda", "Oppah", "Orla", "Panana", "Pyntle", "Quilla", "Ranala", "Reddlepop", "Roywyn", "Salanop", "Shamil", "Siffress", "Symma", "Tana", "Tenena", "Tervaround", "Tippletoe", "Ulla", "Unvera", "Veloptima", "Virra", "Waywocket", "Yebe", "Zanna"
  ],

  GnomeMaleNames: [
    "Alston", "Alvyn", "Anverth", "Arumawann", "Bilbron", "Boddynock", "Brocc", "Burgell", "Cockaby", "Crampernap", "Dabbledob", "Delebean", "Dimble", "Eberdeb", "Eldon", "Erky", "Fablen", "Fibblestib", "Fonkin", "Frouse", "Frug", "Gerbo", "Gimble", "Glim", "Igden", "Jabble", "Jebeddo", "Kellen", "Kipper", "Namfoodle", "Oppleby", "Orryn", "Paggen", "Pallabar", "Pog", "Qualen", "Ribbles", "Rimple", "Roondar", "Sapply", "Seebo", "Senteq", "Sindri", "Umpen", "Warryn", "Wiggens", "Wobbles", "Wrenn", "Zaffrab", "Zook"
  ],

  GnomeClanNames: [
    "Albaratie", "Bafflestone", "Beren", "Boondiggles", "Cobblelob", "Daergel", "Dunben", "Fabblestabble", "Fapplestamp", "Fiddlefen", "Folkor", "Garrick", "Gimlen", "Glittergem", "Gobblefirn", "Gummen", "Horcusporcus", "Humplebumple", "Ironhide", "Leffery", "Lingenhall", "Loofollue", "Maekkelferce", "Miggledy", "Munggen", "Murnig", "Musgraben", "Nackle", "Ningel", "Nopenstallen", "Nucklestamp", "Offund", "Oomtrowl", "Pilwicken", "Pingun", "Quillsharpener", "Raulnor", "Reese", "Rofferton", "Scheppen", "Shadowcloak", "Silverthread", "Sympony", "Tarkelby", "Timbers", "Turen", "Umbodoben", "Waggletop", "Welber", "Wildwander"
  ],

  TieflingFemaleNames: [
    "Ambition", "Art", "Carrion", "Chant", "Creed", "Death", "Debauchery", "Despair", "Doom", "Doubt", "Dread", "Ecstacy", "Ennui", "Entropy", "Excellence", "Fear", "Glory", "Gluttony", "Grief", "Hate", "Hope", "Horror", "Ideal", "Ignominy", "Laughter", "Love", "Lust", "Mayhem", "Mockery", "Murder", "Muse", "Music", "Mystery", "Nowhere", "Open", "Pain", "Passion", "Poetry", "Quest", "Reverence", "Revulsion", "Sorrow", "Temerity", "Torment", "Tragedy", "Vice", "Virtue", "Weary", "Wit"
  ],

  TieflingMaleNames: [
    "Ambition", "Art", "Carrion", "Chant", "Creed", "Death", "Debauchery", "Despair", "Doom", "Doubt", "Dread", "Ecstacy", "Ennui", "Entropy", "Excellence", "Fear", "Glory", "Gluttony", "Grief", "Hate", "Hope", "Horror", "Ideal", "Ignominy", "Laughter", "Love", "Lust", "Mayhem", "Mockery", "Murder", "Muse", "Music", "Mystery", "Nowhere", "Open", "Pain", "Passion", "Poetry", "Quest", "Reverence", "Revulsion", "Sorrow", "Temerity", "Torment", "Tragedy", "Vice", "Virtue", "Weary", "Wit"
  ],

  TieflingClanNames: null,

  HalflingFemaleNames: [
    "Alain", "Andry", "Anne", "Bella", "Blossom", "Bree", "Callie", "Chenna", "Cora", "Dee", "Dell", "Eida", "Eran", "Euphemia", "Georgina", "Gynnie", "Harriet", "Jasmine", "Jillian", "Jo", "Kithri", "Lavinia", "Lidda", "Maegan", "Marigold", "Merla", "Myria", "Nedda", "Nikki", "Nora", "Olivia", "Paela", "Pearl", "Pennie", "Philomena", "Portia", "Robbie", "Rose", "Saral", "Seraphina", "Shaena", "Stacee", "Tawna", "Thea", "Trym", "Tyna", "Vani", "Verna", "Wella", "Willow"
  ],

  HalflingMaleNames: [
    "Alton", "Ander", "Bernie", "Bobbin", "Cade", "Callus", "Corrin", "Dannad", "Danniel", "Eddie", "Egart", "Eldon", "Errich", "Fildo", "Finnan", "Franklin", "Garret", "Garth", "Gilbert", "Gob", "Harol", "Igor", "Jasper", "Keith", "Kevin", "Lazam", "Lerry", "Lindal", "Lyle", "Merric", "Mican", "Milo", "Morrin", "Nebin", "Nevil", "Osborn", "Ostran", "Oswalt", "Perrin", "Poppy", "Reed", "Roscoe", "Sam", "Shardon", "Tye", "Ulmo", "Wellby", "Wendel", "Wenner", "Wes"
  ],

  HalflingClanNames: [
    "Appleblossom", "Bigheart", "Brightmoon", "Brushgather", "Cherrycheeks", "Copperkettle", "Deephollow", "Elderberry", "Fastfoot", "Fatrabbit", "Glenfellow", "Goldfound", "Goodbarrel", "Goodearth", "Greenbottle", "Greenleaf", "High-hill", "Hilltopple", "Hogcollar", "Honeypot", "Jamjar", "Kettlewhistle", "Leagallow", "Littlefoot", "Nimblefingers", "Porridgepot", "Quickstep", "Reedfellow", "Shadowquick", "Silvereyes", "Smoothhands", "Stonebridge", "Stoutbridge", "Stoutman", "Strongbones", "Sunmeadow", "Swiftwhistle", "Tallfellow", "Tealeaf", "Tenpenny", "Thistletop", "Thorngage", "Tosscobble", "Underbough", "Underfoot", "Warmwater", "Whispermouse", "Wildcloak", "Wildheart", "Wiseacre"
  ],

  HalfElfFemaleNames: null,

  HalfElfMaleNames: null,

  HalfElfClanNames: null,

  KoboldFemaleNames: [
    "Arix", "Eks", "Ett", "Galax", "Garu", "Hagnar", "Hox", "Irtos", "Kashak", "Meepo", "Molo", "Ohsoss", "Rotom", "Sagin", "Sik", "Sniv", "Taklak", "Tes", "Urak", "Varn"
  ],

  KoboldMaleNames: [
    "Arix", "Eks", "Ett", "Galax", "Garu", "Hagnar", "Hox", "Irtos", "Kashak", "Meepo", "Molo", "Ohsoss", "Rotom", "Sagin", "Sik", "Sniv", "Taklak", "Tes", "Urak", "Varn"
  ],

  KoboldClanNames: [" "],

  TabaxiFemaleNames: [
    "Cloud on the Mountaintop", "Five Timber", "Jade Shoe", "Left-Handed Hummingbird", "Seven Thundercloud", "Skirt of Snakes ", "Smoking Mirror"
  ],

  TabaxiMaleNames: [
    "Cloud on the Mountaintop", "Five Timber", "Jade Shoe", "Left-Handed Hummingbird", "Seven Thundercloud", "Skirt of Snakes ", "Smoking Mirror"
  ],

  TabaxiClanNames: [" "],

  HarengonFemaleNames: null,

  HarengonMaleNames: null,

  HarengonClanNames: [" "],

  AarakocraFemaleNames: [
    "Aera", "Aial", "Aur", "Deekek", "Errk", "Heehk", "Ikki", "Kleeck", "Oorr", "Ouss", "Quaf", "Quierk", "Salleek", "Urreek", "Zeed"
  ],

  AarakocraMaleNames: [
    "Aera", "Aial", "Aur", "Deekek", "Errk", "Heehk", "Ikki", "Kleeck", "Oorr", "Ouss", "Quaf", "Quierk", "Salleek", "Urreek", "Zeed"
  ],

  AarakocraClanNames: [" "],

  KenkuFemaleNames: [
    "Basher", "Clanger", "Cutter", "Growler", "Hammerer", "Mouser", "Rat Scratch", "Sail Snap", "Slicer", "Smasher", "Whistler"
  ],

  KenkuMaleNames: [
    "Basher", "Clanger", "Cutter", "Growler", "Hammerer", "Mouser", "Rat Scratch", "Sail Snap", "Slicer", "Smasher", "Whistler"
  ],

  KenkuClanNames: [" "],

  MouseFemaleNames: ["Brie", "Chechil", "Bergkase", "Brimsen", "Staazer", "Herve", "Gouda"],

  MouseMaleNames: ["Brie", "Chechil", "Bergkase", "Brimsen", "Staazer", "Herve", "Gouda"],

  MouseClanNames: [" "],

  FirbolgFemaleNames: null,

  FirbolgMaleNames: null,

  FirbolgClanNames: null,

  GithyankiFemaleNames: [
    "Aaryl", "B'noor", "Fenelzi'ir", "Jen'lig", "Pah'zel", "Quorstyl", "Sirruth", "Vaira", "Yessune", "Zar'ryth"
  ],

  GithyankiMaleNames: [
    "Elirdain", "Gaath", "Ja'adoc", "Kar'i'nas", "Lykus", "Quith", "Ris'a'an", "Tropos", "Viran", "Xamodas"
  ],

  GithyankiClanNames: [" "],

  GithzeraiFemaleNames: [
    "Adaka", "Adeya", "Ella", "Ezhelya", "Immilzin", "Izera", "Janara", "Loraya", "Uweya", "Vithka"
  ],

  GithzeraiMaleNames: [
    "Dak", "Duurth", "Ferzth", "Greth", "Hurm", "Kalla", "Muurg", "Nurm", "Shrakk", "Xorm"
  ],

  GithzeraiClanNames: [" "],

  GenasiFemaleNames: null,

  GenasiMaleNames: null,

  GenasiClanNames: null,

  LizardFemaleNames: [
    "Achuak (Green)", "Aryte (War)", "Bae-shra (Animal)", "Darastrix (Dragon)", "Garurt (Axe)", "Irhtos (Secret)", "Jhank (Hammer)", "Kepesk (Storm)", "Kethend (Gem)", "Korth (Danger)", "Kosj (Small)", "Kothar (Demon)", "Li-trix (Armor)", "Mirik (Song)", "Othokent (Smart)", "Sauriv (Eye)", "Throden (Many)", "Thurkear (Night)", "Usk (Iron)", "Valignat (Burn)", "Vargach (Battle)", "Verthica (Mountain)", "Vutha (Black)", "Vyth (Steel)"
  ],

  LizardMaleNames: [
    "Achuak (Green)", "Aryte (War)", "Bae-shra (Animal)", "Darastrix (Dragon)", "Garurt (Axe)", "Irhtos (Secret)", "Jhank (Hammer)", "Kepesk (Storm)", "Kethend (Gem)", "Korth (Danger)", "Kosj (Small)", "Kothar (Demon)", "Li-trix (Armor)", "Mirik (Song)", "Othokent (Smart)", "Sauriv (Eye)", "Throden (Many)", "Thurkear (Night)", "Usk (Iron)", "Valignat (Burn)", "Vargach (Battle)", "Verthica (Mountain)", "Vutha (Black)", "Vyth (Steel)"
  ],

  LizardClanNames: [" "],

  YuanFemaleNames: [
    "Asutali", "Eztli", "Hessatal", "Hitotee", "Issahu", "Itstli", "Manuya", "Meztli", "Nesalli", "Otleh", "Shalkashlah", "Sisava", "Sitlali", "Soakosh", "Ssimalli", "Suisatal", "Talash", "Teoshi", "Yaotal", "Zihu"
  ],

  YuanMaleNames: [
    "Asutali", "Eztli", "Hessatal", "Hitotee", "Issahu", "Itstli", "Manuya", "Meztli", "Nesalli", "Otleh", "Shalkashlah", "Sisava", "Sitlali", "Soakosh", "Ssimalli", "Suisatal", "Talash", "Teoshi", "Yaotal", "Zihu"
  ],

  YuanClanNames: [" "],

  TortleFemaleNames: [
    "Baka", "Damu", "Gar", "Gura", "Ini", "Jappa", "Kinlek", "Krull", "Lim", "Lop", "Nortle", "Nulka", "Olo", "Ploqwat", "Quee", "Queg", "Quott", "Sunny", "Tibor", "Ubo", "Uhok", "Wabu", "Xelbuk", "Xopa", "Yog"
  ],

  TortleMaleNames: [
    "Baka", "Damu", "Gar", "Gura", "Ini", "Jappa", "Kinlek", "Krull", "Lim", "Lop", "Nortle", "Nulka", "Olo", "Ploqwat", "Quee", "Queg", "Quott", "Sunny", "Tibor", "Ubo", "Uhok", "Wabu", "Xelbuk", "Xopa", "Yog"
  ],

  TortleClanNames: [" "],

  CentaurFemaleNames: [
    "Daiva", "Dunja", "Elnaya", "Galisnya", "Irinya", "Kotyali", "Lalya", "Litisia", "Madya", "Mira", "Nedja", "Nikya", "Ostani", "Pinya", "Rada", "Raisya", "Stasolya", "Tatna", "Zhendoya", "Zoria", "Honotia", "Kelitia", "Lileo", "Meloe", "Bido", "Daxa", "Saya", "Tesia"
  ],

  CentaurMaleNames: [
    "Bonmod", "Boruvo", "Chodi", "Drozan", "Kozim", "Milosh", "Ninos", "Oleksi", "Orval", "Radovas", "Radom", "Rostis", "Svetyos", "Tomis", "Trijiro", "Volim", "Vlodim", "Yarog", "Aughus", "Dririos", "Ormasos", "Volien", "Eno", "Roth", "Skelor", "Stihl"
  ],

  CentaurClanNames: [" "],

  MinotaurFemaleNames: [
    "Akra", "Bolsa", "Cica", "Dakka", "Drakisla", "Eleska", "Enka", "Irnaya", "Jaska", "Kalka", "Makla", "Noraka", "Pesha", "Raisha", "Sokali", "Takyat", "Vrokya", "Veska", "Yelka", "Zarka", "Zoka", "Bozzri", "Dhazdoro", "Erinimachis", "Ghalantzo", "Halafoti", "Kerania", "Mitevra", "Philoprodis", "Tavromiki", "Ypoudoris"
  ],

  MinotaurMaleNames: [
    "Alovnek", "Brogmir", "Brozhdar", "Dornik", "Drakmir", "Drazhan", "Grozdan", "Kalazmir", "Klattic", "Melislek", "Nirikov", "Prezhlek", "Radolak", "Rugilar", "Sarovnek", "Svarakov", "Trovik", "Vraslak", "Yarvem", "Bamvros", "Fotiyinos", "Halafotios", "Keranios", "Menetavro", "Nikavros", "Prodos", "Rhordon", "Tavrostenes", "Thyrogog"
  ],

  MinotaurClanNames: [" "],

  ShifterNames: [
    "Badger", "Bear", "Cat", "Fang", "Grace", "Grim", "Moon", "Rain", "Red", "Scar", "Stripe", "Swift", "Talon", "Wolf"
  ],

  ChangelingNames: [
    "Aunn", "Bin", "Cas", "Dox", "Fie", "Hars", "Jin", "Lam", "Mas", "Nix", "Ot", "Paik", "Ruz", "Sim", "Toox", "Vil", "Yog"
  ],

};

nameListings.TieflingClanNames = nameListings.HumanClanNames;
nameListings.HalfElfFemaleNames = nameListings.HumanFemaleNames;
nameListings.HalfElfMaleNames = nameListings.HumanMaleNames;
nameListings.HalfElfClanNames = nameListings.HumanClanNames;
nameListings.HarengonFemaleNames = nameListings.HalflingFemaleNames;
nameListings.HarengonMaleNames = nameListings.HalflingMaleNames;
nameListings.FirbolgFemaleNames = nameListings.HumanFemaleNames;
nameListings.FirbolgMaleNames = nameListings.HumanMaleNames;
nameListings.FirbolgClanNames = nameListings.HumanClanNames;
nameListings.GenasiFemaleNames = nameListings.HumanFemaleNames;
nameListings.GenasiMaleNames = nameListings.HumanMaleNames;
nameListings.GenasiClanNames = nameListings.HumanClanNames;


// #endregion

// #region Name Dictionary Region
const nameDictionary = {

  Human: {
    Male: nameListings.HumanMaleNames,
    Female: nameListings.HumanFemaleNames,
    Clan: nameListings.HumanClanNames
  },
  Dwarf: {
    Male: nameListings.DwarfMaleNames,
    Female: nameListings.DwarfFemaleNames,
    Clan: nameListings.DwarfClanNames
  },
  Elf: {
    Male: nameListings.ElfMaleNames,
    Female: nameListings.ElfFemaleNames,
    Clan: nameListings.ElfClanNames
  },
  "Half-Orc": {
    Male: nameListings.HumanMaleNames,
    Female: nameListings.HumanFemaleNames,
    Clan: nameListings.HumanClanNames
  },
  Gnome: {
    Male: nameListings.GnomeMaleNames,
    Female: nameListings.GnomeFemaleNames,
    Clan: nameListings.GnomeClanNames
  },
  Tiefling: {
    Male: nameListings.TieflingMaleNames,
    Female: nameListings.TieflingFemaleNames,
    Clan: nameListings.HumanClanNames
  },
  Halfling: {
    Male: nameListings.HalflingMaleNames,
    Female: nameListings.HalflingFemaleNames,
    Clan: nameListings.HalflingClanNames
  },
  "Half-Elf": {
    Male: nameListings.HumanMaleNames,
    Female: nameListings.HumanFemaleNames,
    Clan: nameListings.HumanClanNames
  },
  Kobold: {
    Male: nameListings.KoboldMaleNames,
    Female: nameListings.KoboldFemaleNames,
    Clan: nameListings.KoboldClanNames
  },
  Tabaxi: {
    Male: nameListings.TabaxiMaleNames,
    Female: nameListings.TabaxiFemaleNames,
    Clan: nameListings.TabaxiClanNames
  },
  Harengon: {
    Male: nameListings.HalflingMaleNames,
    Female: nameListings.HalflingFemaleNames,
    Clan: nameListings.HarengonClanNames
  },
  Aarakocra: {
    Male: nameListings.AarakocraMaleNames,
    Female: nameListings.AarakocraFemaleNames,
    Clan: nameListings.AarakocraClanNames
  },
  Kenku: {
    Male: nameListings.KenkuMaleNames,
    Female: nameListings.KenkuFemaleNames,
    Clan: nameListings.KenkuClanNames
  },
  Mousefolk: {
    Male: nameListings.MouseMaleNames,
    Female: nameListings.MouseFemaleNames,
    Clan: nameListings.GnomeClanNames
  },
  Firbolg: {
    Male: nameListings.FirbolgMaleNames,
    Female: nameListings.FirbolgFemaleNames,
    Clan: nameListings.FirbolgClanNames
  },
  Githyanki: {
    Male: nameListings.GithyankiMaleNames,
    Female: nameListings.GithyankiFemaleNames,
    Clan: nameListings.GithyankiClanNames
  },
  Githzerai: {
    Male: nameListings.GithzeraiMaleNames,
    Female: nameListings.GithzeraiFemaleNames,
    Clan: nameListings.GithzeraiClanNames
  },
  Genasi: {
    Male: nameListings.GenasiMaleNames,
    Female: nameListings.GenasiFemaleNames,
    Clan: nameListings.GenasiClanNames
  },
  Lizardfolk: {
    Male: nameListings.LizardMaleNames,
    Female: nameListings.LizardFemaleNames,
    Clan: nameListings.LizardClanNames
  },
  "Yuan-Ti": {
    Male: nameListings.YuanMaleNames,
    Female: nameListings.YuanFemaleNames,
    Clan: nameListings.YuanClanNames
  },
  Tortle: {
    Male: nameListings.TortleMaleNames,
    Female: nameListings.TortleFemaleNames,
    Clan: nameListings.TortleClanNames
  },
  Centaur: {
    Male: nameListings.CentaurMaleNames,
    Female: nameListings.CentaurFemaleNames,
    Clan: nameListings.CentaurClanNames
  },
  Minotaur: {
    Male: nameListings.MinotaurMaleNames,
    Female: nameListings.MinotaurFemaleNames,
    Clan: nameListings.MinotaurClanNames
  },
  Shifter: {
    Male: nameListings.ShifterNames,
    Female: nameListings.ShifterNames,
    Clan: " "
  },
  Changeling: {
    Male: nameListings.ChangelingNames,
    Female: nameListings.ChangelingNames,
    Clan: " "
  },
  Aasimar: {
    Male: nameListings.HumanMaleNames,
    Female: nameListings.HumanFemaleNames,
    Clan: nameListings.HumanClanNames
  }

};

// #endregion

const appearances = [
  "Horribly burnt all over their body and face",
  "Broken nose",
  "Missing an ear",
  "Missing a limb, finger, arm or leg",
  "Lost one of their senses - blind, deaf or mute",
  "Has the mark of a terrible disease on their body",
  "Strong. Has shoulders as wide as they are tall",
  "Exceptionally long limbs",
  "Horribly overweight",
  "Very thin",
  "Somehow sinister looking",
  "Has a limp or a hunched back",
  "Incredibly boring in their looks",
  "Look like any other person in the area",
  "Old but look like they barely get out of their teens",
  "Young but look like they already saw all there was to see",
  "Has an exceptionally athletic body",
  "Not an ounce of fat is visible and they seem ready to jump into action at any time",
  "Has an unusually androgynous look",
  "Has something eerie, out of this world with their appearance. It's striking",
  "Has a noble, holier than thou look",
  "Has a body marked by hard work",
  "Has a delicate physique",
  "Their skin is not used to seeing the sun",
  "Are the picture perfect standard of beauty",
  "Are the first thing that comes to mind when people think of 'beautiful people'",
  "Has impressive hair",
  "An impressive hair colour",
  "Very long hair",
  "Has impressive facial hair",
  "Doesn't have a shred of hair on their body",
  "Has impressive tattoos all over their body",
  "Everything in their appearance makes them look harmless and innocent",
  "Their clothes are pure and without any stain, and they don't wear any sign of hostility ever",
  "Scary looking",
  "Has way too much clothing on them",
  "Wears a scarf, ribbon or vest all the time",
  "Overly accessorized",
  "Every part of their body is covered in jewelry",
  "Has only the bare minimum of clothing on them",
  "Irregardless of the temperature won't even wear clothing at all",
  "Has extremely coloured clothing that stands out in the crowd",
  "Bright colours or flashy patterns, it's impossible to not notice them",
  "Drab-colored clothing",
  "Very sad looking clothing, bland even in their design",
  "Stuck in the past, or what they call the good old days",
  "Dress and act like they were at this time, and constantly complain about now",
  "Wears clothing that no-one is wearing, yet",
  "Their design is avant-garde, strikingly different and looks weird",
  "Wears immaculate and distinguished clothing",
  "So elegant that they could enter any high places at any time",
  "Wearing protective clothing on top of their clothing",
  "Wearing pretentious clothing",
  "Wears way too much makeup",
  "Look horribly sick",
  "Talk very rudely",
  "Dressed and acts in a military fashion",
  "Overly clean",
  "Carrying a bag and followed by a sweet aroma of some sort",
  "Has an extremely strong belief and it shows - emblems, tattoos etc",
  "Not used to wearing their clothes",
  "Wearing clothing that leaves very little to the imagination",
  "As cold looking as a blizzard",
  "Exude warmth and kindness in their appearance",
  "It's hard to not feel comfortable around them",
  "Covered in dirt",
  "Against the system and they are showing it",
  "Look like they gave up on life",
  "Has the air of a beast - facial structure or animal manner",
  "Their face was reconstructed somehow",
  "Has oddly coloured eyes",
  "Has a huge amount of freckles"
];

const quirks = [
  "Has perfect posture",
  "Slumps their shoulders",
  "Rubs their eyes",
  "Scratches their head",
  "Clears their throat often",
  "Leans in to talk",
  "Cracks their knuckles",
  "Bites their nails",
  "Picks at their ears",
  "Runs their fingers through their hair",
  "Twirls mustache/hair a lot",
  "Inhales deeply before speaking",
  "Rubs their chin",
  "Breathes heavily",
  "Cannot sit still",
  "Dances",
  "Coughs a lot",
  "Constantly rubs their own shoulder",
  "Constantly rubs hands",
  "Constantly uses hands when talking",
  "Rubs forehead",
  "Has an animal with them",
  "Combs their hair often",
  "Adjusts glasses",
  "Adjusts clothes",
  "Cleans equipment or weapon",
  "Laid back literally",
  "Yawns a lot",
  "Waves weapon around",
  "Squints eyes",
  "Snaps fingers",
  "Twiddles fingers",
  "Eats constantly",
  "Distracted",
  "Steeples hands like mr burns",
  "Leans on things",
  "Constantly chewing",
  "Smoking a cigar",
  "Smoking a cigar",
  "Smoking a pipe",
  "Blowing smoke rings",
  "Has random spikes of pain",
  "Hands at their side",
  "Hands in a fist",
  "Hands in thinking pose",
  "Stretch forwards a lot",
  "Constantly sighing",
  "Slump on chair",
  "Relaxed on chair",
  "Focused pose",
  "Look around at times",
  "Sip coffee all the time",
  "Hands together in prayer",
  "Boxing pose",
  "Tap notepad they have",
  "Cross arms",
  "Slap table or legs like a lawyer",
  "Wag finger",
  "Shift hair",
  "Dance shoulders",
  "Hunched shoulders",
  "Straight shoulders",
  "Bang on table angrily",
  "Straight robot hands",
  "Hands on hips",
  "Rubs dirt between fingers",
  "Checks palms",
  "Gun hands",
  "Searches pockets"
];

const traits = [
  "Two Traits", "Kind", "Loyal", "Open-Minded", "Intelligent", "Rude", "Two-Faced", "Prejudice", "Ignorant", "Crazy", "Humble",
  "Brave", "Creative", "Assertive", "Arrogant", "Cowardly", "Cunning", "Hesitant", "Gentle", "Honest", "Decisive",
  "Spoiled", "Cruel", "Liar", "Indecisive", "Cautious", "Polite", "Generous", "Wise", "Reasonable", "Blunt", "Selfish",
  "Naive", "Stubborn", "Outgoing", "Diligent", "Sincere", "Emotional", "Reserved", "Careless", "Sarcastic", "Apathetic",
  "Cheerful", "Responsible", "Orderly", "Funny", "Brooding", "Unreliable", "Messy", "Serious", "Sensitive", "Shy",
  "Hardworking", "Charming", "Callous", "Impulsive", "Lazy", "Moody", "Easygoing", "Reckless", "Immature", "Independent",
  "Dependent", "Energetic", "Frugal", "Modest", "Determined", "Quiet", "Extravagant", "Vain", "Petty", "Patient",
  "Mischevious", "Persistent", "Pious", "Rash", "Obedient", "Meek", "Paranoid"
];

const occupations = [
  "Temple Work", "Temple Work",
  "Gambler",
  "Criminal",
  "Entertainer",
  "Artisan", "Artisan", "Artisan", "Artisan", "Artisan",
  "Explorer",
  "Exile", "Hermit", "Refugee", "Refugee",
  "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer", "Farmer",
  "Noble", "Politician",
  "Alchemist", "Astronomer", "Wizard's Apprentice", "Scribe", "Researcher",
  "Sailor", "Sailor", "Sailor", "Pirate",
  "Soldier", "Officer", "Cavalry", "Healer", "Military Cook",
];

const flaws = [
  "Has a forbidden love or Susceptible to romance",
  "Enjoys decadent pleaseures",
  "Arrogant",
  "Envies another's possessions or station",
  "Is overpoweringly greedy",
  "Prone to rage",
  "Has a powerful enemy",
  "Has a specific phobia",
  "Shameful or Scandalous history",
  "Secret crime or Misdeed",
  "Possession of forbidden lore",
  "Is foolhardily brave"
];

const voices = [
  "Speaks fast with a small lisp",
  "Deep voice with rolling R's",
  "Pronounces most S's like Z's",
  "French accent - 'Monsieur'",
  "Low and grunting tone",
  "High pitched and excited",
  "Often laughs before speaking",
  "Relaxed with a lot of content humming",
  "Scratchy and weak accent",
  "Posh accent",
  "Mostly speaks with clenched teeth",
  "Soft and melodious voice",
  "Pronounces most O's like U's",
  "Eastern European accent - 'Ven I was seventeeen. Back een Israell",
  "Old and thin voice",
  "Farmer's accent - 'Ooh by gum'",
  "Puts emphasis on the wrong part of words - ",
  "Slow speaker",
  "Russian accent - 'Darr, I faind yorr frennd'",
  "Whispering most of the time",
  "Yelps nervously whilst speaking",
  "Sighs with exhaustion a lot",
  "Scottish accent - 'Namesh bond. Jamesh bond",
  "Scottish accent - 'Acckk there'll be naugh stopping meh'",
  "Uses the word 'Darling' a lot",
  "Loud with a lot of bravado",
  "Often pauses mid-sentence to think",
  "Australian accent - 'Good'day rippa!'",
  "Boyish",
  "Notes of animalistic growling and snarling",
  "Smooth and feminine",
  "Raspy voice",
  "Italian accent - 'Eyy gesepe. Maamaa Miaa'",
  "Excited and jittery voice",
  "Warm and comforting accent",
  "Half singing most sentences",
  "Speaks in the back of the mouth",
  "Scandinavian accent 'Sp-illl-ing",
  "Speaks like royalty, uses complex vocabulary",
  "Words like 'its' and 'is' become 'eats' and 'ease'",
  "Vocalizes with an open throat",
  "Jamaican Accent 'Ey mon!'",
  "Frightened voice",
  "Hard of hearing, loud voice",
  "Dark and ominous tone",
  "American accent - 'Aaa swearrr'",
  "Smacks lips whilst talking",
  "Monstrous and snarling",
  "Gruff and masculine voice",
  "Vocalizes in the front of the mouth",
  "Tuts and clicks tongue a lot",
  "Adds syllables to words to emphasize",
  "Vocalizes with a squeezed throat",
  "Squeaky accent",
  "Pirate accent",
  "Speaks like their tongue is numb",
  "Classic creaky witch voice",
  "Spits and sputters whilst talking",
  "Thin and often mumbling voice",
  "Speaks with their lower jaw jutted out",
  "Irish accent - 'Pertato pertato'",
  "Soothing and warm voice",
  "Keeps vowels as short as possible",
  "Low rumbling, the words strung together",
  "Strong lisp",
  "Mid range voice",
  "German accent 'ein svein'",
  "Speaks with lips slightly pursed",
  "Speaks in third person about themselves",
  "Relaxed voice",
  "Sensual and smooth voice",
  "Low range voice",
  "Mumbles notes to self in between sentences",
  "Agressive tone",
  "Draws out most vowels when speaking",
  "Nasal tone",
  "High range voice",
  "Often pronounces difficult words wrong",
  "Forgets to breathe when speaking",
  "Hollow sounding voice",
  "Switches between three voices",
  "Slurs words",
  "Voice like an elderly individual",
  "Speaks as if they have a cold/blocked nose",
  "High pitched and slightly raspy"
];

const ideals = [
  "Beauty or Domination",
  "Charity or Greed",
  "Greater good or Might",
  "Life or Pain",
  "Respect or Retribution",
  "Self-sacrifice or Slaughter",
  "Community or Change",
  "Fairness or Creativity",
  "Honor or Freedom",
  "Logic or Independence",
  "Responsibility or No limits",
  "Tradition or Fun",
  "Balance or Aspiration",
  "Knowledge or Discovery",
  "Live and let live or Glory",
  "Moderation or Nation",
  "Neutrality or Redemption",
  "People or Self-knowledge"
];

const bonds = [
  "Dedicated to fulfilling a personal life goal",
  "Protective of close family members",
  "Protective of colleagues or compatriots",
  "Loyal to a benefactor, patron, or employer",
  "Captivated by a romantic interest",
  "Drawn to a special place",
  "Protective of a sentimental keepsake",
  "Protective of a valuable possession",
  "Out for revenge"
];

// #region Motivation Region
const motivationverbs = [
  "Advises",
  "Shepherds",
  "Takes",
  "Works",
  "Manages",
  "Obtains",
  "Abuses",
  "Discovers",
  "Accompanys",
  "Suppresses",
  "Attempts",
  "Indulges",
  "Deters",
  "Offends",
  "Proclaims",
  "Spoils",
  "Chronicles",
  "Acquires",
  "Guides",
  "Operates",
  "Oppresses",
  "Fulfills",
  "Damages",
  "Learns",
  "Publicizes",
  "Persecutes",
  "Refines",
  "Interacts",
  "Drives",
  "Burdens",
  "Communicates",
  "Creates",
  "Abducts",
  "Aids",
  "Follows",
  "Implements",
  "Processes",
  "Explains",
  "Discourages",
  "Conceives",
  "Guards",
  "Collaborates",
  "Steals",
  "Attends",
  "Detects",
  "Progresses",
  "Conquers",
  "Strives",
  "Weakens",
  "Achieves",
  "Secures",
  "Records",
  "Constructs",
  "Encourages",
  "Agonizes",
  "Comprehends",
  "Administers",
  "Relates",
  "Institutes",
  "Accounts",
  "Seeks",
  "Supports"
];

const motivationnouns1 = [
  "Wealth",
  "Hardship",
  "Affluence",
  "Resources",
  "Prosperity",
  "Poverty",
  "Opulence",
  "Deprivation",
  "Success",
  "Distress",
  "Contraband",
  "Music",
  "Literature",
  "Technology",
  "Alcohol",
  "Medicines",
  "Beauty",
  "Strength",
  "Intelligence",
  "Force"
];

const motivationnouns2 = [
  "The wealthy",
  "The populous",
  "Enemies",
  "The public",
  "Religion",
  "The poor",
  "Family",
  "The elite",
  "Academia",
  "The forsaken",
  "The law",
  "The government",
  "The oppressed",
  "Friends",
  "Criminals",
  "Allies",
  "Secret societies",
  "The world",
  "Military",
  "The church"
];

const motivationnouns3 = [
  "Dreams",
  "Discretion",
  "Love",
  "Freedom",
  "Pain",
  "Faith",
  "Slavery",
  "Enlightenment",
  "Racism",
  "Sensuality",
  "Dissonance",
  "Peace",
  "Discrimination",
  "Disbelief",
  "Pleasure",
  "Hate",
  "Happiness",
  "Servitude",
  "Harmony",
  "Justice"
];

const motivationnouns4 = [
  "Gluttony",
  "Lust",
  "Envy",
  "Greed",
  "Laziness",
  "Wrath",
  "Pride",
  "Purity",
  "Moderation",
  "Vigilance",
  "Zeal",
  "Composure",
  "Charity",
  "Modesty",
  "Atrocities",
  "Cowardice",
  "Narcissism",
  "Compassion",
  "Valor",
  "Patience"
];

const motivationnouns5 = [
  "Advice",
  "Propaganda",
  "Science",
  "Knowledge",
  "Communications",
  "Lies",
  "Myths",
  "Riddles",
  "Stories",
  "Legends",
  "Industry",
  "New religions",
  "Progress",
  "Animals",
  "Ghosts",
  "Magic",
  "Nature",
  "Old religions",
  "Expertise",
  "Spirits"
];

const waylayadjectives = [
  "Futile",
  "Harsh",
  "Binding",
  "Unreliable",
  "Abnormal",
  "Impassioned",
  "Leeching",
  "Noble",
  "Altruistic",
  "Abstract",
  "Hesitant",
  "Tranquil",
  "Copious",
  "Storied",
  "Irritating",
  "Benign",
  "Inclusive",
  "Retired",
  "Tapped",
  "Hidden",
  "Revered",
  "Righteous",
  "Provoking",
  "Tedious",
  "Hallowed",
  "Pedantic",
  "Attentive",
  "Ordinary",
  "Quiet",
  "Illusory",
  "Grim",
  "Inexplicable",
  "Prolonged",
  "Exotic",
  "Legendary",
  "Common",
  "Corrupt",
  "Deceiving",
  "Impervious",
  "Prolonged",
  "Bitter",
  "Roaring",
  "Savage",
  "Fledgling",
  "Meek",
  "Impassioned",
  "Unmistakable",
  "Drowsy",
  "Fixated",
  "Proficient",
  "Perceiving",
  "Sudden",
  "Mundane",
  "Illuminating",
  "Forbidden",
  "Selfish",
  "Impending",
  "Abrupt",
  "Exhausting",
  "Fantastic",
  "Prohibited",
  "Fragile",
  "Unforeseen",
  "Honorable",
  "Accidental",
  "Brusque",
  "Painless",
  "Peaceful",
  "Exclusive",
  "Malevolent",
  "Prosperous",
  "Haphazard",
  "Steady",
  "Apparent",
  "Unlikely",
  "Depraved",
  "Foreign",
  "Abetting",
  "Valuable",
  "Problematic",
  "Comforting",
  "Ravenous",
  "Stale",
  "Haunting",
  "Eccentric",
  "Hopeless",
  "Adept",
  "Regular",
  "Migrant",
  "Lethargic",
  "Waning",
  "Barbaric",
  "Dubious",
  "Pleasant",
  "Amusing",
  "Regimental",
  "Disputable",
  "Exclusive",
  "Incompetent",
  "Afflicting"
];

const waylaynouns = [
  "Animals",
  "Mooks",
  "Mob",
  "Bandits",
  "Deputies",
  "Bounty hunter",
  "Soldiers",
  "Monster",
  "Villain",
  "Horror",
  "Ascetic",
  "Research",
  "Occult",
  "Enigma",
  "Science",
  "Pursuit",
  "Trap",
  "Struggle",
  "Illness",
  "Labor",
  "Army",
  "Invader",
  "Holdings",
  "Authority",
  "Rebels",
  "Festival",
  "Hermit",
  "Tavern",
  "Hamlet",
  "Conclave",
  "Misunderstanding",
  "Accusations",
  "Power play",
  "Friend-in-need",
  "Disappearance",
  "Traitor",
  "Lover",
  "Death",
  "Relative",
  "Rival",
  "Heaven / Hell",
  "Afterlife",
  "Myth",
  "Otherworldly",
  "The Strange",

  "Weather",
  "Straying / Lost",
  "Social environ",
  "Deprivation",
  "The Wild"
];

const waylaysolutions = [
  "Legendary help",
  "Act of nature",
  "The people",
  "Enemy help",
  "Avoidance",
  "Scarcely-used ability",
  "Personal resources",
  "Close friend",
  "Strong attribute",
  "Favoured ability",
  "Favoured skill",
  "An accident",
  "Weak attribute",
  "Counteraction",
  "Faction intervention",
  "The authority",
  "Fate",
  "Change of heart",
  "An unexpected power"
];

const villainTraits = {
  1: "Aggressive",
  2: "Angry",
  3: "Awkward",
  4: "Belittling",
  5: "Capricious",
  6: "Charmless",
  7: "Cheerless",
  8: "Compulsive",
  9: "Cruel-overtly",
  10: "Cruel-secretively",
  11: "Cunning",
  12: "Deceitful",
  13: "Delusional",
  14: "Dour",
  15: "Draconian",
  16: "Erratic",
  17: "Faded",
  18: "Greedy",
  19: "Hungry",
  20: "Hyper",
  21: "Immature",
  22: "Irritable",
  23: "Isolated",
  24: "Jealous",
  25: "Lazy",
  26: "Manipulative",
  27: "Meek",
  28: "Melodramatic",
  29: "Merciless",
  30: "Miserable",
  31: "Moody",
  32: "Narcissistic",
  33: "Opinionated",
  34: "Outrageous",
  35: "Paranoid",
  36: "Pathetic",
  37: "Pessimist",
  38: "Precise",
  39: "Puritanical",
  40: "Racist",
  41: "Repressed",
  42: "Scathing",
  43: "Self-important",
  44: "Self-indulgent",
  45: "Selfish",
  46: "Timid",
  47: "Troubled",
  48: "Vain",
  49: "Vindictive",
  50: "Vulgar"
};

const villainCrooks = {
  1: "Always seems to have an open wound or blemish",
  2: "Attends to an imaginary parent and speaks to him or her loudly and often",
  3: "Awakes at night screaming and falls asleep by day",
  4: "Believes herself to be of royal blood",
  5: "Believes one of the PCs is in love with her-and likes it",
  6: "Believes one of the PCs is in love with him-and loathes the idea",
  7: "Blesses everyone she meets",
  8: "Can\’t sleep",
  9: "Carries an imaginary baby",
  10: "Collects something unusual, obsessively",
  11: "Constantly attends to everyone else\’s needs",
  12: "Constantly crafting-sewing or carving or baking",
  13: "Constantly prepared for imminent Armageddon",
  14: "Covers her skin when outdoors",
  15: "Dances most of the time",
  16: "Dresses in black",
  17: "Dresses outrageously",
  18: "Eats constantly",
  19: "Finds everything hilarious",
  20: "Frowns all the time",
  21: "Gives money away constantly and is often followed by beggars",
  22: "Has a bizarre pet she adores",
  23: "Has a dark secret",
  24: "Has a piglet/kitten/puppy and thinks it\’s a baby",
  25: "Has a second-completely opposed-personality",
  26: "Has an all-consuming passion",
  27: "Is an obsessive artist",
  28: "Is incredibly self-important",
  29: "Is obsessed with another local NPC/club/family",
  30: "Is obsessive about a PC",
  31: "Is obsessively clean",
  32: "Is often surrounded by an imaginary flock of small birds-usually starlings",
  33: "Is often surrounded by one particular type of domestic animal",
  34: "Is outwardly amazingly cheerful",
  35: "Is passionate about something unusual",
  36: "Is still in mourning for a long-dead spouse",
  37: "Is very loud",
  38: "Obsessively scratches",
  39: "Prays constantly",
  40: "Sees devils sitting on other people\’s shoulders",
  41: "Sees her body as a canvas",
  42: "Sings hymns obsessively",
  43: "Smiles all the time",
  44: "Speaks to the dead",
  45: "Speaks with an imaginary friend in tongues",
  46: "Talks regularly about his past lives",
  47: "Talks to a glove puppet confidante",
  48: "Talks to herself",
  49: "Wants something desperately",
  50: "Wears a mask"
};

// #endregion

const menuRaces = [
  'Human', 'Dwarf', 'Elf', 'Half-Orc', 'Gnome', 'Tiefling', 'Halfling',
  'Half-Elf', 'Kobold', 'Tabaxi', 'Harengon', 'Aarakocra', 'Kenku',
  'Mousefolk', 'Firbolg', 'Githyanki', 'Githzerai', 'Genasi', 'Lizardfolk',
  'Yuan-Ti', 'Tortle', 'Centaur', 'Minotaur', 'Shifter', 'Changeling', 'Aasimar'
];

const charAge = new
  Array(1).fill("Kid")
  .concat(new Array(4).fill("Teenage"))
  .concat(new Array(10).fill("Young Adult"))
  .concat(new Array(40).fill("Adult"))
  .concat(new Array(45).fill("Late Adult"))
  .concat(new Array(4).fill("Elderly"))
  .concat(new Array(1).fill("Ancient"));

const goals1 = [
  "To avenge",
  "To spread the good word",
  "To reunite with a loved one",
  "To make money",
  "To make amends",
  "To explore a mysterious place",
  "To uncover a hidden truth",
  "To locate a lost thing",
  "To kill a hated foe",
  "To conquer a faraway land",
  "To cure an illness",
  "To craft a masterwork",
  "To survive just one more day",
  "To earn affection",
  "To prove a point",
  "To be smarter, faster and stronger",
  "To heal an old wound",
  "To extinguish an evil forever",
  "To hide from a shameful fact",
  "To evangelize",
  "To spread suffering",
  "To prove worth",
  "To rise in rank",
  "To be praised",
  "To discover the truth",
  "To make good on a bet",
  "To get out of an obligation",
  "To convince someone to do their dirty work",
  "To steal something valuable",
  "To overcome a bad habit",
  "To commit an atrocity",
  "To earn renown",
  "To accumulate power",
  "To save someone from a monstrosity",
  "To teach",
  "To settle down",
  "To get just one more haul",
  "To preserve the law",
  "To discover",
  "To devour",
  "To restore the family name",
  "To live a quiet life",
  "To help others",
  "To atone",
  "To prove their worth",
  "To gain honor",
  "To expand their land",
  "To gain a title",
  "To retreat from society",
  "To escape",
  "To party",
  "To return home",
  "To serve",
  "To reclaim what was taken",
  "To do what must be done",
  "To be a champion",
  "To avoid notice",
  "To help a family member",
  "To perfect a skill",
  "To travel",
  "To overcome a disadvantage",
  "To play the game",
  "To establish a dynasty",
  "To improve the realm",
  "To retire",
  "To recover a lost memory",
  "To battle",
  "To become a terror to criminals",
  "To raise dragons",
  "To live up to expectations",
  "To become someone else",
  "To do what can’t be done",
  "To be remembered in song",
  "To be forgotten",
  "To find true love",
  "To lose their mind",
  "To indulge",
  "To make the best of it",
  "To find the one",
  "To destroy an artifact",
  "To show them all",
  "To bring about unending summer",
  "To fly",
  "To find the six-fingered man",
  "To wake the ancient sleepers",
  "To entertain",
  "To follow an order",
  "To die gloriously",
  "To be careful",
  "To show kindness",
  "To not screw it all up",
  "To uncover the past",
  "To go where no man has gone before",
  "To do good",
  "To become a beast",
  "To spill blood",
  "To live forever",
  "To hunt the most dangerous game",
  "To hate",
  "To run away"
];

const knacks = [
  "Criminal connections",
  "Muscle",
  "Skill with a specific weapon",
  "Hedge wizardry",
  "Comprehensive local knowledge",
  "Noble blood",
  "A one-of-a-kind item",
  "Special destiny",
  "Unique perspective",
  "Hidden knowledge",
  "Magical awareness",
  "Abnormal parentage",
  "Political leverage",
  "A tie to a monster",
  "A secret",
  "True love",
  "An innocent heart",
  "A plan for the perfect crime",
  "A one-way ticket to paradise",
  "A mysterious ore",
  "Money, money, money",
  "Divine blessing",
  "Immunity from the law",
  "Prophecy",
  "Secret martial arts techniques",
  "A ring of power",
  "A much-needed bag of taters",
  "A heart",
  "A fortified position",
  "Lawmaking",
  "Tongues",
  "A discerning eye",
  "Endurance",
  "A safe place",
  "Visions",
  "A beautiful mind",
  "A clear voice",
  "Stunning looks",
  "A catchy tune",
  "Invention",
  "Baking",
  "Brewing",
  "Smelting",
  "Woodworking",
  "Writing",
  "Immunity to fire",
  "Cooking",
  "Storytelling",
  "Ratcatching",
  "Lying",
  "Utter unremarkableness",
  "Mind-bending sexiness",
  "Undefinable coolness",
  "A way with knots",
  "Wheels of polished steel",
  "A magic carpet",
  "Endless ideas",
  "Persistence",
  "A stockpile of food",
  "A hidden path",
  "Piety",
  "Resistance to disease",
  "A library",
  "A silver tongue",
  "Bloodline",
  "An innate spell",
  "Balance",
  "Souls",
  "Speed",
  "A sense of right and wrong",
  "Certainty",
  "An eye for detail",
  "Heroic self-sacrifice",
  "Sense of direction",
  "A big idea",
  "A hidden entrance to the city",
  "The love of someone powerful",
  "Unquestioning loyalty",
  "Exotic fruit",
  "Poison",
  "Perfect memory",
  "The language of birds",
  "A key to an important door",
  "Metalworking",
  "Mysterious benefactors",
  "Steely nerves",
  "Bluffing",
  "A trained wolf",
  "A long-lost sibling, regained",
  "An arrow with your name on it",
  "A true name",
  "Luck",
  "The attention of supernatural powers",
  "Kindness",
  "Strange tattoos",
  "A majestic beard",
  "A book in a strange language",
  "Power overwhelming",
  "Delusions of grandeur",
  "The wind at his back and a spring in his step"
];

const relationships = [
  "Acquaintance",
  "Kidnapper",
  "Admirer",
  "Lover",
  "Adviser",
  "Maid",
  "Ally",
  "Master",
  "Apprentice",
  "Mentor",
  "Assistant",
  "Niece or nephew",
  "Aunt or uncle",
  "Nemesis",
  "Believer",
  "Oppressor",
  "Beneficiary",
  "Paid companion",
  "Best friend",
  "Paramour",
  "Blackmailer",
  "Parent",
  "Bodyguard",
  "Patron",
  "Business partner",
  "Pen pal",
  "Business rival",
  "Political prisoner",
  "Buyer",
  "Political rival",
  "Captive",
  "Predator",
  "Captor",
  "Prey",
  "Champion",
  "Prisoner",
  "Child",
  "Protege",
  "Client",
  "Quarry",
  "Coach",
  "Right hand",
  "Collaborator",
  "Rival suitor",
  "Colleague",
  "Servant",
  "Competitor",
  "Sibling",
  "Confessor",
  "Snitch",
  "Confidant",
  "Social rival",
  "Contact",
  "Source",
  "Crush",
  "Sponsor",
  "Customer",
  "Spouse",
  "Debtholder",
  "Stalker",
  "Debtor",
  "Step-child",
  "Disciple",
  "Step-parent",
  "Donor",
  "Step-sibling",
  "Employee",
  "Steward",
  "Employer",
  "Student",
  "Ex-spouse",
  "Suitor",
  "Fan",
  "Supplicant",
  "Fiance",
  "Supplier",
  "Frenemy",
  "Sweetheart",
  "Grandchild",
  "Teacher",
  "Grandparent",
  "Teammate",
  "Guardian",
  "Thrall",
  "Guest",
  "Tormentor",
  "Half-sibling",
  "Trainer",
  "Harasser",
  "Unrequited love",
  "Henchman",
  "Valet",
  "Housekeeper",
  "Vassal",
  "Idol",
  "Victim",
  "Investor",
  "War buddy",
  "Jilted lover",
  "Ward",
  "Hates",
  "Is blackmailing",
  "Is illegitimate child of",
  "Heard rumours about",
  "Using black magic on",
  "Is extorting",
  "Constantly mocks",
  "Suspicious of",
  "Jealous of",
  "Has stolen from",
  "Always seeks to outdo",
  "Collect on a debt",
  "Is cheating on",
  "Is the friend that always gets them in trouble",
  "Is turning people against",
  "Sabotaging their relationship",
  "Spying on",
  "Claims credit for their accomplishments",
  "Feeds disinformation to",
  "Is owed a gambling debt by",
  "Was once an adventurer with them, which ended badly",
  "Knows secrets about",
  "Is an estranged lover of",
  "Is an estranged lover of their sibling",
  "Was a failed business partner of",
  "Family history of conflict with",
  "Lost a legal judgement to",
  "Friend",
  "Ally",
  "In love with",
  "Courting",
  "Firm friends with",
  "Secretly protecting",
  "Generous towards",
  "Admirer of",
  "Doing nice things for",
  "Neighbours with",
  "Walks dogs for",
  "Coworkers with",
  "Went to school with",
  "Gave good advice to",
  "Student of",
  "Tutor of",
  "Employed by",
  "Bodyguard of",
  "Tended to while sick",
  "Saved by",
  "Met on the road",
  "Met during adventure",
  "Tavern frequenters",
  "Have traded goods for a long time"
];

const occupations2 = [
  "Abbot",
  "Jailer",
  "Acolyte",
  "Jester",
  "Acrobat",
  "Jeweler",
  "Adviser",
  "Juggler",
  "Alchemist",
  "Knight",
  "Apothecary",
  "Lady",
  "Archer",
  "Locksmith",
  "Magician",
  "Artisan",
  "Mariner",
  "Artist",
  "Merchant",
  "Baker",
  "Minstrel",
  "Beggar",
  "Monarch",
  "Blacksmith",
  "Moneylender",
  "Bookbinder",
  "Monk",
  "Brewer",
  "Musician",
  "Burglar",
  "Orphan",
  "Circus performer",
  "Outlander",
  "Carpenter",
  "Outlaw",
  "Composer",
  "Page",
  "Cook",
  "Peddler",
  "Count",
  "Pilgrim",
  "Courtier",
  "Poacher",
  "Cutpurse",
  "Poisoner",
  "Doctor",
  "Priest",
  "Dogcatcher",
  "Prince",
  "Dramaturge",
  "Privateer",
  "Duke",
  "Ratcatcher",
  "Earl",
  "Scholar",
  "Eunuch",
  "Scribe",
  "Executioner",
  "Sellsword",
  "Falconer",
  "Ship’s captain",
  "Farmer",
  "Shopkeeper",
  "Fence",
  "Smuggler",
  "Fisherman",
  "Soldier",
  "Fishwife",
  "Spy",
  "Fortuneteller",
  "Squire",
  "Galley slave",
  "Student",
  "Gambler",
  "Swindler",
  "Gardener",
  "Tailor",
  "General",
  "Tavern wench",
  "Gladiator",
  "Thespian",
  "Governess",
  "Tomb robber",
  "Gravedigger",
  "Torturer",
  "Horse breeder",
  "Trapper",
  "Guard",
  "Urchin",
  "Herbalist",
  "Vagrant",
  "Hermit",
  "Viscount",
  "Hunter",
  "Vizier",
  "Innkeeper",
  "Wigmaker",
  "Interpreter",
  "Young lady"
];


// Exporting all
export const Variables = {
  currentCharacter,
  resultsHistory,
  nameArray,
  clanArray,
  raceType,
  sexType,
  flawText,
  voiceText,
  races,
  sexes,
  nameListings,
  nameDictionary,
  appearances,
  quirks,
  traits,
  occupations,
  flaws,
  voices,
  ideals,
  bonds,
  motivationverbs,
  motivationnouns1,
  motivationnouns2,
  motivationnouns3,
  motivationnouns4,
  motivationnouns5,
  waylayadjectives,
  waylaynouns,
  waylaysolutions,
  villainTraits,
  villainCrooks,
  menuRaces,
  charAge
}