// Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Brand = require('../models/brand');
const Guitar = require('../models/guitar');
const GuitarInstance = require('../models/guitarInstance');
const Series = require('../models/series');

// guitar instance creation increments stock of series and guitar(model)

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
    stock: 0,
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
  series
) => {
  const seriesDetail = {
    brand: brand,
    model: model,
    stock: 0,
    colors: colors,
    description: description,
    features: features,
    series: series,
  };
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
  const newSeries = new GuitarInstance(guitarDetail);
  newSeries.save((err) => {
    if (err) {
      console.error(err);
    }
  });
  Guitar.findOneAndUpdate(
    { model: model, brand: brand },
    {
      $inc: { stock: 1 },
    }
  ).exec();
  Series.findOneAndUpdate(
    { model: model, brand: brand, series: series },
    {
      $inc: { stock: 1 },
    }
  ).exec();
};

const ibanez = createBrand(
  'Ibanez',
  'Ibanez is a Japanese guitar brand owned by Hoshino Gakki.[1] Based in Nagoya, Aichi, Japan, Hoshino Gakki were one of the first Japanese musical instrument companies to gain a significant foothold in import guitar sales in the United States and Europe, as well as the first brand of guitars to mass-produce the seven-string guitar and eight-string guitar. Ibanez manufactures effects, accessories, amps, and instruments in Japan, China, Indonesia and in the United States (at a Los Angeles-based custom shop). As of 2017 they marketed nearly 165 models of bass guitar, 130 acoustic guitars, and more than 300 electric guitars. After Gibson and Fender, Ibanez is considered the third biggest guitar brand.'
);
const fender = createBrand(
  'Fender',
  'The Fender Musical Instruments Corporation (FMIC, or simply Fender) is an American manufacturer of instruments and amplifiers. Fender produces acoustic guitars, bass amplifiers and public address equipment, however it is best known for its solid-body electric guitars and bass guitars, particularly the Stratocaster, Telecaster, Jaguar, Jazzmaster, Precision Bass, and the Jazz Bass. The company was founded in Fullerton, California by Clarence Leonidas "Leo" Fender in 1946.'
);
const gibson = createBrand(
  'Gibson',
  'Gibson Brands, Inc. (formerly Gibson Guitar Corporation) is an American manufacturer of guitars, other musical instruments, and professional audio equipment from Kalamazoo, Michigan, and now based in Nashville, Tennessee. The company was formerly known as Gibson Guitar Corporation and renamed Gibson Brands, Inc. on June 11, 2013.'
);
const jackson = createBrand(
  'Jackson',
  'Jackson is a manufacturer of electric guitars and electric bass guitars that bears the name of its founder, Grover Jackson. The company was acquired by the Fender Musical Instruments Corporation in 2002, which manufactures Jackson-branded guitars in its Corona, California, US and Ensenada, Mexico facilities. Low-priced "budget" models are produced by sub-contractors in Indonesia and China.'
);

const rg = createModel(
  ibanez,
  'RG',
  'The Ibanez RG is a series of electric guitars produced by Hoshino Gakki and one of the best-selling superstrat-style guitars ever made. The first model in the series, the RG550, was originally released in 1987 and advertised as part of the Roadstar series. That series was renamed "RG" in 1992 and all models since are simply known as RGs.'
);
const jem = createModel(
  ibanez,
  'JEM',
  "The Ibanez JEM is an electric guitar manufactured by Ibanez and first produced in 1987. The guitar's most notable user is its co-designer, Steve Vai. As of 2010, there have been five sub-models of the JEM: the JEM7, JEM77, JEM777, JEM555, JEM333, and JEM70V. Although the Ibanez JEM series is a signature series guitar, Ibanez mass-produces several of the guitar's sub-models. The design of the Ibanez JEM series was heavily influenced by the superstrat style of guitars of the early 1980s such as the Jackson Soloist, Kramer Beretta and Hamer Chaparral. This type of guitar is more aggressively styled in terms of shape and specifications compared to the Stratocaster on which they are based."
);

const strat = createModel(
  fender,
  'Stratocaster',
  'The Fender Stratocaster, colloquially known as the Strat, is a model of electric guitar designed from 1952 into 1954 by Leo Fender, Bill Carson, George Fullerton, and Freddie Tavares. The Fender Musical Instruments Corporation has continuously manufactured the Stratocaster since 1954. It is a double-cutaway guitar, with an extended top "horn" shape for balance. Along with the Gibson Les Paul, Gibson SG, and Fender Telecaster, it is one of the most-often emulated electric guitar shapes.'
);
const tele = createModel(
  fender,
  'Telecaster',
  "The Fender Telecaster is an electric guitar produced by Fender. Together with its sister model the Esquire, it is the world's first mass-produced, commercially successful solid-body electric guitar. Its simple yet effective design and revolutionary sound broke ground and set trends in electric guitar manufacturing and popular music."
);

const lp = createModel(
  gibson,
  'Les Paul',
  'The Gibson Les Paul is a solid body electric guitar that was first sold by the Gibson Guitar Corporation in 1952. The guitar was designed by factory manager John Huis and his team with input from and endorsement by guitarist Les Paul. Its typical design features a solid mahogany body with a carved maple top and a single cutaway, a mahogany set-in neck with a rosewood fretboard, two pickups with independent volume and tone controls, and a stoptail bridge, although variants exist.'
);
const sg = createModel(
  gibson,
  'SG',
  'The Gibson SG is a solid-body electric guitar model introduced by Gibson in 1961 as the Gibson Les Paul SG. It remains in production today in many variations of the initial design. The SG (where "SG" refers to Solid Guitar) Standard is Gibson\'s best-selling model of all time.'
);

const rr = createModel(
  jackson,
  'Rhodes',
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
const amUltra = createSeries(
  fender,
  strat,
  amUltColors,
  amUltDesc,
  amUltFeat,
  'American Ultra Stratocaster'
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
const playerHSS = createSeries(
  fender,
  strat,
  pHColors,
  pHDesc,
  pHFeat,
  'Player Stratocaster HSS'
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
const nash = createSeries(fender, telecaster, nashColors, nashDesc, nashFeat, 'Player Plus Nashville Telecaster')

