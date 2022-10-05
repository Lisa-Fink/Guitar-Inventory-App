const Brand = require('./models/brand');
const Guitar = require('./models/guitar');
const GuitarInstance = require('./models/guitarInstance');
const Series = require('./models/series');
// Set up mongoose connection
const mongoose = require('mongoose');
// const mongoDB = // enter string here
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const clearData = async () => {
  // clear brands
  await Brand.deleteMany({});
  // clear guitar models
  await Guitar.deleteMany({});
  // clear series
  await Series.deleteMany({});
  // clear guitar instances
  await GuitarInstance.deleteMany({});
};

// Create functions
const createBrand = async (name, about) => {
  const brandDetail = { name, about };
  const newBrand = new Brand(brandDetail);
  newBrand.save((err) => {
    if (err) {
      console.error(err);
    }
  });
  return newBrand;
};

const createModel = async (brand, model, description) => {
  const modelDetail = {
    brand: brand,
    model: model,
    description: description,
    type: 'Electric Guitar',
  };
  const newModel = new Guitar(modelDetail);
  newModel.save((err) => {
    if (err) {
      console.error(err);
    }
  });
  return newModel;
};

const createSeries = async (
  brand,
  model,
  colors,
  description,
  features,
  series,
  stock
) => {
  const seriesDetail = {
    brand: brand,
    model: model,
    stock: stock,
    colors: colors,
    features: features,
    series: series,
  };
  if (description) {
    seriesDetail.description = description;
  }
  const newSeries = new Series(seriesDetail);
  newSeries.save((err) => {
    if (err) {
      console.error(err);
    }
  });
  return newSeries;
};

const createGuitar = async (brand, model, color, series, price, serialNum) => {
  const guitarDetail = {
    brand,
    model,
    color,
    series,
    price,
    serialNum,
  };
  const newGuitar = new GuitarInstance(guitarDetail);
  newGuitar.save((err) => {
    if (err) {
      console.error(err);
    }
  });
};

const populate = async () => {
  await clearData();

  const ibanez = await createBrand(
    'Ibanez',
    'Ibanez is a Japanese guitar brand owned by Hoshino Gakki.[1] Based in Nagoya, Aichi, Japan, Hoshino Gakki were one of the first Japanese musical instrument companies to gain a significant foothold in import guitar sales in the United States and Europe, as well as the first brand of guitars to mass-produce the seven-string guitar and eight-string guitar. Ibanez manufactures effects, accessories, amps, and instruments in Japan, China, Indonesia and in the United States (at a Los Angeles-based custom shop). As of 2017 they marketed nearly 165 models of bass guitar, 130 acoustic guitars, and more than 300 electric guitars. After Gibson and Fender, Ibanez is considered the third biggest guitar brand.'
  );
  const fender = await createBrand(
    'Fender',
    'The Fender Musical Instruments Corporation (FMIC, or simply Fender) is an American manufacturer of instruments and amplifiers. Fender produces acoustic guitars, bass amplifiers and public address equipment, however it is best known for its solid-body electric guitars and bass guitars, particularly the Stratocaster, Telecaster, Jaguar, Jazzmaster, Precision Bass, and the Jazz Bass. The company was founded in Fullerton, California by Clarence Leonidas "Leo" Fender in 1946.'
  );
  const gibson = await createBrand(
    'Gibson',
    'Gibson Brands, Inc. (formerly Gibson Guitar Corporation) is an American manufacturer of guitars, other musical instruments, and professional audio equipment from Kalamazoo, Michigan, and now based in Nashville, Tennessee. The company was formerly known as Gibson Guitar Corporation and renamed Gibson Brands, Inc. on June 11, 2013.'
  );
  const jackson = await createBrand(
    'Jackson',
    'Jackson is a manufacturer of electric guitars and electric bass guitars that bears the name of its founder, Grover Jackson. The company was acquired by the Fender Musical Instruments Corporation in 2002, which manufactures Jackson-branded guitars in its Corona, California, US and Ensenada, Mexico facilities. Low-priced "budget" models are produced by sub-contractors in Indonesia and China.'
  );

  const rg = await createModel(
    ibanez,
    'RG',
    'The Ibanez RG is a series of electric guitars produced by Hoshino Gakki and one of the best-selling superstrat-style guitars ever made. The first model in the series, the RG550, was originally released in 1987 and advertised as part of the Roadstar series. That series was renamed "RG" in 1992 and all models since are simply known as RGs.'
  );
  const jem = await createModel(
    ibanez,
    'JEM',
    "The Ibanez JEM is an electric guitar manufactured by Ibanez and first produced in 1987. The guitar's most notable user is its co-designer, Steve Vai. As of 2010, there have been five sub-models of the JEM: the JEM7, JEM77, JEM777, JEM555, JEM333, and JEM70V. Although the Ibanez JEM series is a signature series guitar, Ibanez mass-produces several of the guitar's sub-models. The design of the Ibanez JEM series was heavily influenced by the superstrat style of guitars of the early 1980s such as the Jackson Soloist, Kramer Beretta and Hamer Chaparral. This type of guitar is more aggressively styled in terms of shape and specifications compared to the Stratocaster on which they are based."
  );

  const strat = await createModel(
    fender,
    'Stratocaster',
    'The Fender Stratocaster, colloquially known as the Strat, is a model of electric guitar designed from 1952 into 1954 by Leo Fender, Bill Carson, George Fullerton, and Freddie Tavares. The Fender Musical Instruments Corporation has continuously manufactured the Stratocaster since 1954. It is a double-cutaway guitar, with an extended top "horn" shape for balance. Along with the Gibson Les Paul, Gibson SG, and Fender Telecaster, it is one of the most-often emulated electric guitar shapes.'
  );
  const tele = await createModel(
    fender,
    'Telecaster',
    "The Fender Telecaster is an electric guitar produced by Fender. Together with its sister model the Esquire, it is the world's first mass-produced, commercially successful solid-body electric guitar. Its simple yet effective design and revolutionary sound broke ground and set trends in electric guitar manufacturing and popular music."
  );

  const lp = await createModel(
    gibson,
    'Les Paul',
    'The Gibson Les Paul is a solid body electric guitar that was first sold by the Gibson Guitar Corporation in 1952. The guitar was designed by factory manager John Huis and his team with input from and endorsement by guitarist Les Paul. Its typical design features a solid mahogany body with a carved maple top and a single cutaway, a mahogany set-in neck with a rosewood fretboard, two pickups with independent volume and tone controls, and a stoptail bridge, although variants exist.'
  );
  const sg = await createModel(
    gibson,
    'SG',
    'The Gibson SG is a solid-body electric guitar model introduced by Gibson in 1961 as the Gibson Les Paul SG. It remains in production today in many variations of the initial design. The SG (where "SG" refers to Solid Guitar) Standard is Gibson\'s best-selling model of all time.'
  );

  const rr = await createModel(
    jackson,
    'Rhoads',
    'The Jackson Rhoads is a model of electric guitar, originally commissioned by guitarist Randy Rhoads and produced by Jackson Guitars.'
  );

  // strat series
  const amUltDesc =
    'American Ultra is our most advanced series of guitars and basses for discerning players who demand the ultimate in precision, performance and tone. The American Ultra Stratocaster features a unique “Modern D” neck profile with Ultra rolled fingerboard edges for hours of playing comfort, and the tapered neck heel allows easy access to the highest register. A speedy 10”-14” compound-radius fingerboard with 22 medium-jumbo frets means effortless and accurate soloing, while the Ultra Noiseless™ Vintage pickups and advanced wiring options provide endless tonal possibilities – without hum. The sculpted rear body contours are as beautiful as they are functional and the S-1 switch adds the neck pickup in to any switch position. This versatile, state-of-the-art instrument will inspire you to push your playing to new heights.';
  const amUltFeat = [
    'Alder or ash body with sculpted rear contours',
    'Three Ultra Noiseless Vintage Strat single-coil pickups',
    '“Modern D”-shaped neck with Ultra satin finish',
    '10”-14” compound-radius fingerboard; 22 medium-jumbo frets',
    'Includes premium molded hardshell case',
  ];
  const amUltColors = ['sunburst', 'white', 'black', 'blue'];
  const amUltra = await createSeries(
    fender,
    'Stratocaster',
    amUltColors,
    amUltDesc,
    amUltFeat,
    'American Ultra Stratocaster',
    4
  );

  const pHDesc =
    'The inspiring sound of a Stratocaster is one of the foundations of Fender. Featuring this classic sound—bell-like high end, punchy mids and robust low end, combined with crystal-clear articulation—the sonically flexible Player Stratocaster HSS is packed with authentic Fender feel and style. It’s ready to serve your musical vision, it’s versatile enough to handle any style of music and it’s the perfect platform for creating your own sound.';
  const pHFeat = [
    'Alder body with gloss finish',
    'One Player Series humbucking bridge pickup; two Player Series single-coil Stratocaster middle and neck pickups',
    '“Modern C"-shaped neck profile',
    '9.5"-radius fingerboard',
    '2-point tremolo bridge with bent-steel saddles',
  ];
  const pHColors = ['sunburst', 'white', 'black', 'blue', 'yellow', 'orange'];
  const playerHSS = await createSeries(
    fender,
    'Stratocaster',
    pHColors,
    pHDesc,
    pHFeat,
    'Player Stratocaster HSS',
    6
  );

  // telecaster series
  const nashDesc =
    'Fusing classic Fender design with player-centric features and exciting new finishes, the Player Plus Nashville Telecaster® delivers superb playability and unmistakable style. Powered by a set of Player Plus Noiseless pickups, the Player Plus Nashville Tele® delivers warm, sweet Tele® twang – as well as Strat® in-between tones – without hum. A push-pull switch on the tone control engages the neck pickup in switch positions 1 & 2 for two additional tones. The silky satin Modern “C” Player Plus Tele® neck fits your hand like a glove, with smooth rolled edges for supreme comfort. The 12” radius fingerboard and 22 medium jumbo frets facilitate fluid leads and choke free bends. A modern 6-saddle Tele bridge with block steel saddles adds a touch of brightness while providing precise intonation and the locking tuners provide rock-solid tuning and make string changes quick and easy. With classic Fender style, advanced features and stunning new finishes, the Player Plus Nashville Telecaster is the perfect tool to spark your creativity and stand out from the crowd.';
  const nashFeat = [
    'Player Plus Noiseless Telecaster® & Strat® pickups',
    '12” radius fingerboard with rolled edges',
    'Modern 6-saddle Tele bridge with block steel saddles',
    'Push-pull tone control engages neck pickup in position 1 & 2',
    'Locking tuning machines',
  ];
  const nashColors = ['sunburst', 'yellow', 'orange', 'blue'];
  const nash = await createSeries(
    fender,
    'Telecaster',
    nashColors,
    nashDesc,
    nashFeat,
    'Player Plus Nashville Telecaster',
    6
  );

  // rg series
  const rg5170Feat = [
    'Fishman® Fluence pickups w/voicing switch',
    'Super Wizard HP 5pc Maple/Wenge neck',
    'Macassar Ebony fretboard',
    'Lo-Pro Edge tremolo bridge',
    'Gotoh® machine heads',
  ];
  const rg5170Colors = ['silver'];
  const rg5170G = await createSeries(
    ibanez,
    'RG',
    rg5170Colors,
    null,
    rg5170Feat,
    'RG5170G Prestige',
    2
  );

  // jem series
  const jem7Feat = [
    'Ebony fretboard w/Gold Step off-set dot inlay',
    'The Wizard 5pc Maple/Walnut neck w/KTS™ TITANIUM rods',
    'DiMarzio® Evolution® Pickups',
    "Edge Tremolo Bridge w/Lion's Claw tremolo cavity",
    'Premium Fret Edge Treatment',
  ];
  const jem7VP = await createSeries(
    ibanez,
    'JEM',
    ['white'],
    null,
    jem7Feat,
    'JEM7VP',
    1
  );
  // les paul series
  const stanFeat = [
    'ABR-1 Tune-O-Matic bridge',
    'Aluminum Stop Bar tailpiece',
    'Vintage Deluxe tuners with Keystone buttons',
    'Gold Top Hat knobs with dial pointers',
    'Open-coil Burstbucker™ 1 (neck) and Burstbucker 2 (bridge) pickups are hand-wired to audio taper potentiometers and Orange Drop® capacitors',
  ];
  const stanDesc =
    "The new Les Paul™ Standard 50s Faded returns to the classic design that made it relevant, played, and loved -- shaping sound across generations and genres of music. It pays tribute to Gibson's Golden Era of innovation and brings authenticity back to life. The Les Paul Standard 50s features a satin nitrocellulose lacquer finish that gives it the look and feel of a long-treasured musical companion. It has a solid mahogany body with an AA figured maple top and a rounded 50s-style mahogany neck with a rosewood fingerboard and trapezoid inlays. ";
  const stanColors = ['yellow'];
  const standard = await createSeries(
    gibson,
    'Les Paul',
    stanColors,
    stanDesc,
    stanFeat,
    'Les Paul Standard 50s Faded',
    1
  );

  // sg series

  // rhoads series
  const rxFeat = [
    '26.5”-scale, 7-string guitar',
    'Poplar body',
    'Through-body maple neck with graphite reinforcement, scarf joint and satin color matched back finish',
    '12”-16” compound radius bound laurel fingerboard with 24 jumbo frets and pearloid sharkfin inlays',
    'Active EMG® 81-7H bridge and EMG 85-7H neck humbucking pickups',
    'Active electronics',
    'Three-position pickup blade switch, two volume controls and single tone control',
    'Floyd Rose Special 7-string double-locking tremolo bridge system',
    'Jackson sealed die-cast tuners and standard strap buttons',
  ];
  const rxDesc =
    'The 7-string Jackson® X Series Rhoads RRX24-MG7 is a slick music-making machine innovatively engineered for modern metal and other styles that require a high-performance instrument. We’ve poured all of our hard-earned knowledge into this guitar to create a beast of an instrument that represents over 40 years of experience creating extreme tools for extreme players. \
\
The RRX24-MG7 features a 26.5” scale length, poplar body and through-body maple neck with scarf joint and graphite reinforcement to guard against climate-induced warping. Hosting 24 jumbo frets and Jackson’s distinctive pearloid sharkfin inlays, the 12"-16" compound radius bound laurel fingerboard curves more dramatically at the nut for easy chording and flattens out as it approaches the neck joint for low-action bends without fretting out. \
\
Designed for an extended sonic palette, this 7-string beast is fueled with EMG® 81-7H bridge and EMG 85-7H neck humbucking pickups that blend powerful intensity, fluid sustain and muscular growl for blistering leads that slice through even the densest mix. Command your sound with three-way pickup blade switching, two volume knobs and a single tone knob, and count on rock-solid tuning stability throughout the most aggressive dive bombs or harmonic squeals with the Floyd Rose® Special 7-string double-locking tremolo bridge system. \
\
Known for slick style that refuses to sacrifice one iota of functionality, the Jackson X Series Rhoads RRX24-MG7 makes a bold statement onstage in a Satin Black finish with Primer Gray Bevels, reverse Jackson pointed 7-in-line black headstock and black hardware.';
  const rx = await createSeries(
    jackson,
    'Rhoads',
    ['black'],
    rxDesc,
    rxFeat,
    'X Series Rhoads RRX24-MG7',
    2
  );

  const jsFeat = [
    '22.5" SHORT SCALE LENGTH',
    'dual Jackson high-output humbucking pickups with three-way blade switching',
    'single volume and tone controls',
    'string-through-body hardtail bridge with block saddles and black hardware',
  ];
  const jsDesc = `Spotlight-stealing looks and giant sound in a small package!

With its 2/3 scale length (22.5”), the Jackson® JS Series RR Minion JS1X is perfect for little shredders or grownup road dogs who need an easy-traveling instrument jam-packed with the features they love.

The RR Minion JS1X offers a poplar body, speedy bolt-on maple neck with graphite-reinforcement rods and tilt-back headstock, and a 12”-radius amaranth fingerboard with 24 jumbo frets and sharkfin inlays.`;
  const js = await createSeries(
    jackson,
    'Rhoads',
    ['black'],
    jsDesc,
    jsFeat,
    'JS Series RR Minion JS1X',
    3
  );

  // am ultra strat guitars
  const strat1 = await createGuitar(
    fender,
    'Stratocaster',
    'sunburst',
    'American Ultra Stratocaster',
    2099.99,
    'US22097856'
  );
  const strat2 = await createGuitar(
    fender,
    'Stratocaster',
    'sunburst',
    'American Ultra Stratocaster',
    2099.99,
    'US22097857'
  );
  const strat3 = await createGuitar(
    fender,
    'Stratocaster',
    'blue',
    'American Ultra Stratocaster',
    2099.99,
    'US22094567'
  );
  const strat4 = await createGuitar(
    fender,
    'Stratocaster',
    'white',
    'American Ultra Stratocaster',
    2099.99,
    'US22096688'
  );

  // player series strat guitars
  const strat5 = await createGuitar(
    fender,
    'Stratocaster',
    'white',
    'Player Stratocaster HSS',
    879.99,
    'MX22091135'
  );
  const strat6 = await createGuitar(
    fender,
    'Stratocaster',
    'white',
    'Player Stratocaster HSS',
    879.99,
    'MX22091136'
  );
  const strat7 = await createGuitar(
    fender,
    'Stratocaster',
    'white',
    'Player Stratocaster HSS',
    879.99,
    'MX22062351'
  );
  const strat8 = await createGuitar(
    fender,
    'Stratocaster',
    'sunburst',
    'Player Stratocaster HSS',
    909.99,
    'MX22071538'
  );
  const strat9 = await createGuitar(
    fender,
    'Stratocaster',
    'sunburst',
    'Player Stratocaster HSS',
    909.99,
    'MX22071539'
  );
  const strat10 = await createGuitar(
    fender,
    'Stratocaster',
    'black',
    'Player Stratocaster HSS',
    879.99,
    'MX22276431'
  );
  // nashville tele guitars
  const tele1 = await createGuitar(
    fender,
    'Telecaster',
    'sunburst',
    'Player Plus Nashville Telecaster',
    1129.99,
    'MX22135306'
  );
  const tele2 = await createGuitar(
    fender,
    'Telecaster',
    'sunburst',
    'Player Plus Nashville Telecaster',
    1129.99,
    'MX22135307'
  );
  const tele3 = await createGuitar(
    fender,
    'Telecaster',
    'yellow',
    'Player Plus Nashville Telecaster',
    1129.99,
    'MX22133275'
  );
  const tele4 = await createGuitar(
    fender,
    'Telecaster',
    'orange',
    'Player Plus Nashville Telecaster',
    1129.99,
    'MX22134654'
  );
  const tele5 = await createGuitar(
    fender,
    'Telecaster',
    'orange',
    'Player Plus Nashville Telecaster',
    1129.99,
    'MX22134655'
  );
  const tele6 = await createGuitar(
    fender,
    'Telecaster',
    'blue',
    'Player Plus Nashville Telecaster',
    1129.99,
    'MX22156731'
  );

  // rg 5170 guitars
  const rg1 = await createGuitar(
    ibanez,
    'RG',
    'silver',
    'RG5170G Prestige',
    2199.99,
    '210001F22136366'
  );
  const rg2 = await createGuitar(
    ibanez,
    'RG',
    'silver',
    'RG5170G Prestige',
    2199.99,
    '210001F22136367'
  );

  // rg jem guitars
  const jem1 = await createGuitar(
    ibanez,
    'JEM',
    'white',
    'JEM7VP',
    1799.99,
    '210001F22132143'
  );

  // les paul standard 50s faded guitars
  const lp1 = await createGuitar(
    gibson,
    'Les Paul',
    'yellow',
    'Les Paul Standard 50s Faded',
    2499.99,
    '215920036'
  );

  // x-series rhoads guitars
  const rr1 = await createGuitar(
    jackson,
    'Rhoads',
    'black',
    'X Series Rhoads RRX24-MG7',
    1049.99,
    '235098'
  );
  const rr2 = await createGuitar(
    jackson,
    'Rhoads',
    'black',
    'X Series Rhoads RRX24-MG7',
    1049.99,
    '235099'
  );

  // minion guitars
  const rr3 = await createGuitar(
    jackson,
    'Rhoads',
    'black',
    'JS Series RR Minion JS1X',
    189.99,
    '2378042'
  );
  const rr4 = await createGuitar(
    jackson,
    'Rhoads',
    'black',
    'JS Series RR Minion JS1X',
    189.99,
    '2378043'
  );
  const rr5 = await createGuitar(
    jackson,
    'Rhoads',
    'black',
    'JS Series RR Minion JS1X',
    189.99,
    '2378044'
  );
};

populate();
