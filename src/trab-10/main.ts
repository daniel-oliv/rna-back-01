// const { PCA } = require('ml-pca');
import * as logger from 'winston'
import { PCA, IPCAOptions} from "ml-pca";
import { shuffle } from "lodash";
import { getTrainTestData } from "./datasets/idx_ubyte_to_json";
import { MnistDataset } from "./datasets/mnist";
import { TLP, TLP_Params } from "./two-layer-perceptron/perceptron";
import { ThreeLP, ThreeLP_Params } from './three-layer-perceptron/perceptron';
import { parseCSV } from '../utils/fileMan'
import { FxyDataset } from './datasets/fxy';

const pcaVar = [0.06300901392896256,0.04577136554693944,0.0414530808616204,0.03322649251772968,0.02749470275007585,0.02471376301371675,0.021822934150923023,0.01910669194067465,0.017394857862342964,0.016063031562046214,0.01515099689652812,0.013652897759373329,0.012597963451686678,0.012092022174438624,0.011646436753484677,0.011404053696609956,0.011080795361158236,0.01073611053978781,0.010166095846079293,0.009697332678880616,0.009557939684748953,0.00943712896167487,0.008947106172553133,0.008642473690467284,0.008135364612455993,0.007916190907258756,0.00784332788427226,0.007583225038723112,0.00748835549882254,0.007459469640700463,0.007194855676227798,0.007036488096444358,0.006965905803743687,0.006566192728867671,0.006441639139702898,0.006396322318639743,0.006301740320271355,0.006294846120784118,0.006212712297504629,0.005923759248224755,0.005772768205421734,0.005664065466959039,0.005569233161877117,0.005431375239699011,0.005319881331649531,0.005194067016573778,0.005056464903833864,0.005038784839544475,0.004907509231932582,0.004825081547835844,0.004747029485248218,0.004675830629041221,0.00457810509804143,0.004505049089916735,0.004456897269190222,0.004317075182874041,0.004283870642256712,0.004172465721380775,0.004076041592522323,0.004051037235871567,0.003944609402012222,0.0038742297880468494,0.0037744534573664248,0.003735860699782009,0.0037185621207380185,0.0036919069863741156,0.003655707213028085,0.003498393375990434,0.003423518715072775,0.003401352030245044,0.003316579721992768,0.003279064483933648,0.003250880374285157,0.0031939788082449355,0.003146642636659516,0.003133583549156249,0.003053463991404439,0.003046565614416199,0.0029946473314703577,0.002970398133471906,0.0029341210702484885,0.0029076406751281005,0.002848057664012317,0.002777589936794945,0.002770850924442744,0.002756002853556441,0.0027306838041704132,0.0026440278674843168,0.0026104899327289398,0.002578032803862061,0.0025485685511966692,0.0025041179420345195,0.0024736293315820125,0.0024546911651962843,0.0024169071288052506,0.0024080467431312775,0.002331409711283195,0.002319488694519062,0.0022767356110033245,0.0022725612080086344,0.002229241334894317,0.002203844068925887,0.0021709550464976183,0.0021391042859799023,0.0021111021050632755,0.002095436799569808,0.0020711310982070423,0.0020484316672507354,0.0020303045545025686,0.0019949983976768927,0.0019828281141788585,0.0019482904470078607,0.0019091523537861843,0.0018748793587873708,0.0018453377490941804,0.0018179743810568475,0.0018086045822646496,0.0017833401977168748,0.0017550163640669715,0.0017446451482373746,0.001738227891272795,0.0017202404136750801,0.0017002922593786327,0.0016602166417288944,0.0016540154928743657,0.0016312117840855032,0.0016165452629040224,0.001612362880603577,0.0015869311101006814,0.001575848336595634,0.0015544137677227863,0.001536183630027856,0.0015273754131978603,0.0015254717465802625,0.0015071542521393581,0.0014972978652486502,0.0014764007129116847,0.001440263087608783,0.0014299495763027406,0.001417972298246879,0.0014101506358374183,0.0014000451223319449,0.0013938815114771519,0.0013721046963747596,0.0013615340215290767,0.001349955029756789,0.0013095813030599651,0.0013034900994424177,0.0012988371687626915,0.0012751330585129513,0.0012589607075774417,0.0012475265026144606,0.0012418778649834167,0.001233075401509317,0.0012159598861229178,0.0012048960927758365,0.0011763790847596205,0.0011707156741627522,0.0011516257981464696,0.0011446387486142389,0.0011334886386964564,0.001126992953745092,0.0010992585560266996,0.001096802825457313,0.0010822349891290983,0.001074207536873885,0.0010667590123462252,0.0010426585544312035,0.0010239974517564354,0.001006407177086085,0.0009996581644182536,0.0009941151274073454,0.0009782815061131073,0.0009674536477114303,0.0009640530761301667,0.00095289047803635,0.0009238117823582282,0.0009177912888118379,0.0009122461972338162,0.000887595622206514,0.0008804862655154112,0.0008734973953436631,0.0008689886383334379,0.0008572884536874331,0.0008474521966172619,0.0008415616222149893,0.0008230123521943167,0.0008201352025959065,0.000800351786372289,0.0007957546396907295,0.0007854095815622213,0.0007799584749456162,0.0007685967291875247,0.0007636254591054042,0.0007519406452237031,0.0007417267442012493,0.0007377268408491101,0.0007318141512799849,0.0007233434921433226,0.0007103127287349245,0.0007030211886513933,0.0006963741378466683,0.000694017927482435,0.0006857590667308772,0.0006716353236621274,0.0006667537989655796,0.0006568257845244949,0.0006469289162370512,0.0006441839410355194,0.0006379153112523099,0.0006261958715429505,0.0006164602426378723,0.0006136745987295933,0.0006048555813337217,0.0005922302147274571,0.0005871276228130572,0.0005810558696450064,0.0005709205245433846,0.000567116282093313,0.0005597904780878857,0.0005559986605305952,0.00055011726778103,0.0005464355933605858,0.0005413017521921967,0.0005366816051596611,0.0005330715164604394,0.000528804053001326,0.0005219694524857053,0.0005203504945054456,0.0005096385983765795,0.0005022443508612387,0.0005013158077363987,0.0004964995420351156,0.0004917670852640737,0.00048377484573850497,0.00047780878080268046,0.00047604579854229574,0.0004707084919034058,0.0004681128027206755,0.00046436515091312304,0.0004551088847638009,0.00044862474750141976,0.0004414298203436847,0.00043864421399818763,0.0004344548645256144,0.00043114545848191646,0.00042696632004348843,0.0004253344513731207,0.00041818118147852085,0.0004124197320076037,0.0004078911796214254,0.0004055455360230718,0.00040012201808101286,0.00039614984171224373,0.0003941388410076764,0.0003885934135083601,0.00038187667790999383,0.0003814040324335585,0.00037487253461281636,0.0003722443730005149,0.0003693646347084647,0.00036646512916072054,0.00036467156942364404,0.00036281510527929857,0.00035632315510127825,0.00035412523837135407,0.00035123074988316404,0.00034962921633070146,0.0003429057968547826,0.00033627988088675653,0.00033429020619662114,0.000331802890716373,0.00032999720902565784,0.000324246539556444,0.00032185170276481683,0.00031841881807281023,0.0003172353446293521,0.0003121209458160634,0.00031128336900441224,0.00030739598668779133,0.00030315520637589857,0.00030159603941045066,0.00030040424672585713,0.00029714998096945516,0.00029565633369748825,0.00028883779234236605,0.0002868409836221823,0.00028259231834202035,0.0002823638394359049,0.00028013148786122427,0.00027878622680705534,0.0002755879802717765,0.0002746088444881335,0.00027252972383355574,0.0002707848426594756,0.0002677878243161448,0.00026372876217476635,0.0002621299844423234,0.0002596549822872588,0.00025693444308185067,0.00025475617546924,0.00025255890684080726,0.00024852810689574695,0.0002459444227992318,0.00024375541824950817,0.0002422076710460361,0.00023940603938593156,0.00023816243723939192,0.00023707239418211936,0.0002338798429181735,0.00023242202662942437,0.00023043302925013464,0.00022804672942566397,0.0002270161304872766,0.00022367393622969904,0.0002230779771360512,0.0002227199876875383,0.0002207012763491068,0.00021802981702468915,0.00021765474829904286,0.0002149910653847149,0.00021267103782782542,0.0002120690078101679,0.00020814028606927008,0.00020754304113192843,0.00020646690848654712,0.00020535019536269122,0.00020171727016140577,0.0002011996780928973,0.00020029929559114336,0.00019835640091750114,0.00019757047351099473,0.000193607910028519,0.000193108756869278,0.0001904519588209283,0.00018996699532650247,0.0001886212515346521,0.00018690826538139672,0.0001851806179416226,0.00018502924256052458,0.00018230571202063907,0.0001809147888716693,0.00018080629114451452,0.00017928908406101288,0.00017641656493488778,0.00017562836396399904,0.0001741689848673244,0.000173268767868491,0.000171450979152231,0.00017064067404272675,0.00016873144764101178,0.00016645648787332477,0.0001653049682990339,0.00016379069625137402,0.00016267190263054084,0.00016238659708036666,0.00016186210907055576,0.00016069480588000196,0.0001586357575067979,0.00015814790957512494,0.0001571276259388073,0.00015530256047420157,0.00015524376638517454,0.0001532422005320808,0.00015275857316192882,0.00015183642412546717,0.00015123342355201192,0.00015019952087374027,0.00014874426931913006,0.00014767074188905052,0.00014601470850696916,0.0001457812854329767,0.0001449809143051483,0.00014460912158386353,0.0001428273105631789,0.00014161882829311306,0.00014047808772617247,0.00013986081581294346,0.00013941169060068066,0.0001386399819358012,0.00013685343957916117,0.0001364724697903528,0.00013474598498863338,0.00013386151801832085,0.00013245208698901172,0.0001318488316674825,0.00013097529674219464,0.0001295842485587367,0.00012909824976068226,0.00012819932502119538,0.00012741392101972302,0.00012616127028645808,0.00012520969923328297,0.0001241755522165277,0.00012365087672037162,0.00012314790040866602,0.00012198404269587012,0.00012186796744283311,0.00012042525007294912,0.00011986474830161732,0.00011878449516519547,0.00011829000807540582,0.00011740073526903463,0.0001167199882874811,0.00011633560254353554,0.00011479794357812847,0.00011451997564924074,0.00011378538210477594,0.00011289928360615229,0.00011265841567700155,0.00011232483385103289,0.0001111734073222648,0.00011074120643049131,0.0001099927596842952,0.00010881810815108438,0.00010831303348062564,0.00010750213311644808,0.00010624256919367736,0.00010594127420841171,0.0001047301386412681,0.00010444514758256079,0.00010374220407433951,0.00010289655098846457,0.00010224519648372626,0.0001010057903364641,0.00010088193978524767,0.00009982813042492927,0.00009978604497728769,0.00009821231837393555,0.00009740689097835767,0.00009621832495181111,0.0000957840992232282,0.00009526366056796734,0.00009506016822753574,0.00009483400485075212,0.00009398987848512713,0.00009366149942260639,0.00009250112120569462,0.00009206468799326746,0.00009111319152276784,0.00009081376378868277,0.00009064720531075695,0.00009008137510704554,0.00008921406476122113,0.00008880354386810897,0.00008819301854733045,0.00008687776540790409,0.00008629316436059192,0.00008523940364528153,0.00008461647606916039,0.00008436184127754836,0.00008404887219093524,
  0.00008342804047107578,0.00008330420752448886,0.00008269974111102764,0.00008096915612111391,0.00008068470378559277,0.00007995551106692092,0.00007980454234025923,0.00007937321660236685,0.00007874899541587218,0.00007855073316548817,0.00007819589043994909,0.00007765990850563302,0.00007745372856732206,0.00007646601740433319,0.00007605091071582508,0.00007585301404443514,0.00007535457479502847,0.00007456126589010135,0.00007411127673569959,0.00007337576404097965,0.00007296277222557599,0.0000724005253782377,0.00007205997163940893,0.00007130799240592289,0.00007089679848967715,0.00007053358995209184,0.0000702369542597062,0.00006983310927563245,0.0000695947242117819,0.00006894841529926746,0.00006859610004980197,0.00006804531166490297,0.0000675990417626411,0.00006694487114942949,0.00006675172029553062,0.00006625429172284698,0.00006599072889549486,0.00006525038254556283,0.00006508435298767575,0.00006417072068402581,0.00006393887813517578,0.00006342971101983443,0.00006314189388053693,0.00006293151278672898,0.00006231131262998922,0.00006211607538144226,0.00006135563967933272,0.0000612763622497649,0.00006097022899441142,0.00006056740727218916,0.00006006166312309688,0.00005964677746808673,0.00005914441420375838,0.00005863549609876096,0.00005844216979460032,0.000058209812598370893,0.000057581317366032464,0.00005731035599362126,0.00005692782421496734,0.00005668651366101337,0.00005640226293208639,0.000056065721468190406,0.00005519993571505568,0.00005490807788005219,0.00005449310072903858,0.00005428604381755776,0.00005375368655209353,0.00005344131683380066,0.000052828956669714153,0.000052633956084939614,0.00005234795800121449,0.000052241426073286336,0.000051846238681272315,0.0000514181421708098,0.0000508125174230982,0.0000502281543731685,0.00005002174482991207,0.000049790130675281586,0.000049194396326838424,0.0000487322875835079,0.00004849650681838371,0.0000477826376410324,0.0000471548503294792,0.0000469450832270681,0.00004674080299054352,0.00004653465469014664,0.00004627702774221301,0.000045971949250024604,0.000045433322360124824,0.00004531082916362061,0.000044672246333377756,0.00004438258715376365,0.00004401873120412009,0.000043939976788732974,0.00004359658547356749,0.000043240390022046654,0.000042752645236059034,0.000042371819227313616,0.000042049459118976314,0.0000419761893077587,0.00004168515546963632,0.00004086997793538032,0.00004080900417767382,0.000040364580354960366,0.00004027000029048529,0.000039853582425321045,0.000039427912337273336,0.00003915954108257231,0.00003878537604714744,0.000038555052656597655,0.00003839267018775093,0.00003828784788042774,0.000037528698562857954,0.000036745350760015,0.00003667805890152346,0.00003625619884372371,0.00003609387744934617,0.000035777607719468864,0.00003560246414637835,0.00003525656184856025,0.000034641094336014365,0.00003455003150610032,0.00003420605569436175,0.00003368634723531134,0.000033243514551466194,0.00003320704692018382,0.00003293646767059835,0.00003285800456680438,0.00003217673173989158,0.000031647423421860633,0.000031346970071537964,0.000031252566501658,0.00003102251116037409,0.000030552869100746524,0.000030458914062177676,0.00002990383737444329,0.000029824683886079333,0.000029384310308331878,0.000029080758606201253,0.00002872686277857345,0.000028529835319148782,0.000028319790570814872,0.00002791964748307183,0.00002775455368219676,0.000027597821812650914,0.000027100646522012696,0.000026712195022303107,0.000026558743950368976,0.00002609962573262798,0.000025652112204739052,0.000025407238341215276,0.000025207836604261393,0.000024764322730229326,0.000024450220902351842,0.000024251848633465806,0.000023818636512082426,0.0000236151311837004,0.000023152113942875288,0.00002286237643310689,0.000022657076803676937,0.000021916109225562607,0.000021643833440826508,0.000021129717887515307,0.000020391108877622892,0.00001903684892371015,0.000018570919445042136,0.000018154200369797004,0.000017226324347891296,0.000014592204607536104,0.00001268211679735713,0.000011645268863878643,0.000006048180220473451,0.0000042412995424561516,0.000001186780276991362,2.719699323623655e-7,2.2257762399153445e-30,9.687360761024418e-33,8.425869569013166e-33,7.59413060965436e-33,7.158566903137028e-33,6.703874213332251e-33,6.184871130039104e-33,5.981417851477533e-33,5.543126247543945e-33,4.958070322264724e-33,4.733888929197791e-33,4.59318586415375e-33,4.0911011990613204e-33,3.7887121160624544e-33,3.438780708214541e-33,3.26418468821549e-33,3.0830987816063976e-33,2.871696084667201e-33,2.677310033744779e-33]

export async function currentMain(){
  const rawDataStr = await parseCSV('./assets/RBF_observacoes.txt',false, '  ')
  // console.log('rawData ', rawData);
  const rawData = rawDataStr.map(vec=>vec.map(d=>+d))
  const trainSet = new FxyDataset('Fxy1', rawData)
  // const testSet = new MnistDataset('mnist', rawData.testData)
  // trainSet.randomlySort();
  
  
  // const setLen = trainSet.data.length + testSet.data.length;
  // const nInputs = trainSet.data[0].inVector.length
  // const nOutputs = trainSet.data[0].targetVector.length;
  // const params: AdalineParams = {
  //   type: 'Adaline',
  //   nInputs: nInputs, 
  //   nOutputs: nOutputs, 
  //   initWeightsMode: {name: 'random',wLimit: 0.1},
  //   learningRate: 0.01,
  //   theta: 0,
  //   maxEpoch: 100,
  //   dwAbsMin: 0.01,
  // }

  // //* TWO
  // const params: TLP_Params = {
  //   type: 'Two Layer Perceptron',
  //   nInputs: nInputs, 
  //   nOutputs: nOutputs, 
  //   initWeightsMode: {name: 'random',wLimit: 0.1},
  //   learningRate: 0.04,
  //   outSigma: 0.09,
  //   hiddenSigma: 0.08,
  //   numHiddenNeurons: 32,
  //   maxEpoch: 300,
  //   dwAbsMin: 0.00001,
  //   lenBatch: 100,
  //   setsLength: {train: Math.floor(0.80*trainSet.data.length), 
  //     test: testSet.data.length, 
  //     validation: Math.floor(0.20*trainSet.data.length)
  //   }
  // }
  // //! CHUTO QUE VAMOS precisar idealmente de dois neurônios na camada de escondida, e não de três
  // const ann = new TLP(params);

  // //* Three
  // const params: ThreeLP_Params = {
  //   type: "Three Layer Perceptron",
  //   nInputs: nInputs, 
  //   nOutputs: nOutputs, 
  //   initWeightsMode: {name: 'random',wLimit: 0.1},
  //   learningRate: 0.09,
  //   outSigma: 0.3,
  //   hiddenSigma: 0.08,
  //   numHiddenNeurons: [15,10],
  //   maxEpoch: 300,
  //   dwAbsMin: 0.00001,
  //   lenBatch: 100,
  //   setsLength: {train: Math.floor(0.80*trainSet.data.length), 
  //     test: testSet.data.length, 
  //     validation: Math.floor(0.20*trainSet.data.length)
  //   }
  // }
  // //! CHUTO QUE VAMOS precisar idealmente de dois neurônios na camada de escondida, e não de três
  // const ann = new ThreeLP(params);

  // // const ret = await ann.train(dataset.data.slice(0,100),(res)=>console.log(res));
  // // console.log('ret ', ret);
  // // const res = ann.testDataset(dataset.data.slice(100,150));
  // // const listener = (res)=>console.log(res);
  // const listener = (res)=>logger.verbose(JSON.stringify(res,null,2));
  // // let timeStr = getTimeString();
  // console.time('trainAndTest');
  // const res = await ann.trainAndTest(trainSet.data.concat(testSet.data), params.setsLength, listener);
  // console.timeEnd('trainAndTest');
  // // console.time('trainCrossValidation');
  // // const res = await ann.trainCrossValidation(trainSet.data.concat(testSet.data), params.setsLength, (res)=>console.log('res ', res));
  // // console.timeEnd('trainCrossValidation');  
  // console.log('res FINAL', res)
  // logger.info(`[trab-07/main,84] RES FINAL  ${JSON.stringify(res,null,2)}`)
  // listener(res);

}