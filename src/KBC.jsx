import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

const APP_NAME = "KAUN BANEGA GENIUS";

const PRIZE_LADDER = [
  { q:1,  prize:"1,000",        safe:false },
  { q:2,  prize:"2,000",        safe:false },
  { q:3,  prize:"3,000",        safe:false },
  { q:4,  prize:"5,000",        safe:false },
  { q:5,  prize:"10,000",       safe:false },
  { q:6,  prize:"20,000",       safe:false },
  { q:7,  prize:"40,000",       safe:false },
  { q:8,  prize:"80,000",       safe:false },
  { q:9,  prize:"1,60,000",     safe:false },
  { q:10, prize:"3,20,000",     safe:true  },
  { q:11, prize:"6,40,000",     safe:false },
  { q:12, prize:"12,50,000",    safe:false },
  { q:13, prize:"25,00,000",    safe:false },
  { q:14, prize:"50,00,000",    safe:false },
  { q:15, prize:"1,00,00,000",  safe:true  },
  { q:16, prize:"7,00,00,000",  safe:false },
];

const LABELS = ["A","B","C","D"];

function getTimer(i) { return i < 5 ? 30 : i < 10 ? 60 : null; } // Q1-5: 30s, Q6-10: 60s, Q11-16: no timer
function getDiff(i)  { return i < 5 ? "easy" : i < 10 ? "medium" : "extremely hard"; }

const TOPICS = [
  "Constitution of India","Indian Penal Code","International Law","Human Rights",
  "Human Biology","Cell Biology","Genetics","Medical Discoveries","Nutrition",
  "Computer Science","Artificial Intelligence","Internet History","Cybersecurity",
  "Physics Laws","Chemistry Elements","Nuclear Physics","Thermodynamics",
  "Mathematics Formulas","Algebra","Geometry","Calculus","Statistics",
  "Bollywood History","Bollywood Awards","Hollywood Blockbusters","Film Awards",
  "Cricket Records","Football","Tennis Grand Slams","Olympic Games",
  "Paralympic Games","Commonwealth Games","Chess Champions","Formula 1",
  "Nobel Prize Winners","Famous Scientists","Scientific Research",
  "Indian Government Policies","United Nations","G20 Summit","BRICS",
  "Business Management","Profit and Loss","Stock Market","Financial Accounting",
  "Economics","GDP","International Trade","Banking",
  "World War I","World War II","Indian Wars","Cold War","Kargil War",
  "Historical Dates","Current Affairs 2024","Current Affairs 2023",
  "Periodic Table","Chemical Reactions","Laws of Motion","Electricity",
  "Human Psychology","Cognitive Psychology","Famous Psychologists",
  "Space Exploration","Solar System","NASA Missions","ISRO Missions",
  "World Organizations","UNESCO","WHO","IMF World Bank",
  "Earth Geography","World Capitals","Mountains","Oceans and Seas",
  "Indian Literature","World Literature","Booker Prize","Nobel Literature",
  "World General Knowledge","Indian General Knowledge","Country Facts",
  "Indian Economy","Economic Theories","Budget Finance",
  "Logical Reasoning","Data Interpretation","Analogies",
  "Indian History","Mughal Empire","Freedom Struggle","Ancient Civilizations",
  "Famous Painters","Architecture Wonders","World Religions","Mythology",
];

const GAME_RULES = [
  "16 questions. Q1-5 easy (30s timer), Q6-10 medium (60s timer), Q11-16 are HARDEST (no timer). Win up to Rs.7 Crore!",
  "Q1-5: 30 second timer (Easy). Q6-10: 60 second timer (Medium). Q11-16: No timer (Hardest).",
  "Checkpoint: Rs.3,00,000 at Q9 and Rs.1,00,00,000 at Q15. Wrong answer = take last checkpoint.",
  "4 Lifelines available: 50:50, Audience Poll, Expert Opinion, Double Chance.",
  "Every lifeline PAUSES the timer. Timer resumes after the lifeline is done.",
  "Double Chance: Use before answering to get 2 tries. Or use after a wrong answer.",
  "If first answer is wrong with Double Chance active, that option locks and you try again.",
  "Translate button switches BOTH the question AND all 4 options to Hindi instantly.",
  "Answer correctly to auto-advance. Wrong answer or time-up ends the game.",
];

// ============================================================
// OFFLINE QUESTION BANK - No internet needed
// ============================================================

var EASY_QS = [
  {question:"Which Amendment to the Indian Constitution added 'Socialist' and 'Secular' to the Preamble?",options:["46th Amendment","44th Amendment","52nd Amendment","42nd Amendment"],correct:3,topic:"Constitution",explanation:"The 42nd Constitutional Amendment (1976) added 'Socialist', 'Secular' and 'Integrity' to the Preamble of the Indian Constitution."},
  {question:"What is the exact percentage of nitrogen in Earth's atmosphere?",options:["84.01%","78.09%","68.03%","72.09%"],correct:1,topic:"Science",explanation:"Nitrogen constitutes 78.09% of Earth's atmosphere, making it the most abundant gas, followed by oxygen at 20.95%."},
  {question:"Under which Article of the Indian Constitution can the President declare a National Emergency?",options:["Article 368","Article 352","Article 360","Article 356"],correct:1,topic:"Constitution",explanation:"Article 352 empowers the President to declare National Emergency when the security of India is threatened by war, external aggression or armed rebellion."},
  {question:"What is the half-life of Carbon-14 used in radiocarbon dating?",options:["9,460 years","3,730 years","12,500 years","5,730 years"],correct:3,topic:"Chemistry",explanation:"Carbon-14 has a half-life of approximately 5,730 years, which makes it useful for dating organic materials up to about 50,000 years old."},
  {question:"Which enzyme is deficient in patients with Phenylketonuria (PKU)?",options:["Fumarylacetoacetase","Homogentisate oxidase","Tyrosinase","Phenylalanine hydroxylase"],correct:3,topic:"Biology",explanation:"PKU is caused by deficiency of phenylalanine hydroxylase, which converts phenylalanine to tyrosine. This leads to toxic buildup of phenylalanine in the blood."},
  {question:"In which year was the Treaty of Westphalia signed, establishing the modern concept of state sovereignty?",options:["1618","1648","1658","1688"],correct:1,topic:"History",explanation:"The Peace of Westphalia (1648) ended the Thirty Years War and established the principle of state sovereignty and non-interference in other nations' internal affairs."},
  {question:"What is the bond angle in a methane (CH4) molecule?",options:["90 degrees","109.5 degrees","104.5 degrees","120 degrees"],correct:1,topic:"Chemistry",explanation:"Methane has a tetrahedral geometry with a bond angle of 109.5 degrees due to four equal sp3 hybridized C-H bonds with no lone pairs."},
  {question:"Who propounded the 'Basic Structure Doctrine' in Indian Constitutional Law?",options:["Hidayatullah J","Sikri CJ","H.R. Khanna J","Subba Rao J"],correct:1,topic:"Law",explanation:"Chief Justice S.M. Sikri propounded the Basic Structure Doctrine in Kesavananda Bharati v State of Kerala (1973), limiting Parliament's power to amend the Constitution."},
  {question:"What is the Laffer Curve in economics?",options:["Relationship between tax rates and tax revenue showing an optimal tax rate","Curve showing trade-off between unemployment and inflation","Relationship between money supply and inflation","Curve showing diminishing returns to capital"],correct:0,topic:"Economics",explanation:"The Laffer Curve illustrates that there is an optimal tax rate that maximizes tax revenue - both 0% and 100% tax rates yield zero revenue, with a peak in between."},
  {question:"What is the work function of caesium metal, making it useful in photoelectric cells?",options:["4.7 eV","3.1 eV","6.4 eV","2.0 eV"],correct:3,topic:"Physics",explanation:"Caesium has a work function of approximately 2.0 eV, one of the lowest of all metals, making it ideal for photoelectric cells as visible light can eject electrons from it."},
  {question:"Which case established the principle of 'Rarest of Rare' doctrine for capital punishment in India?",options:["Bachan Singh v State of Punjab","State of UP v Ram Sagar Yadav","Maneka Gandhi v Union of India","Machhi Singh v State of Punjab"],correct:0,topic:"Law",explanation:"Bachan Singh v State of Punjab (1980) established the 'rarest of rare' doctrine - death penalty should only be given in the most exceptional circumstances where life imprisonment is insufficient."},
  {question:"What is the Chandrasekhar Limit in astrophysics?",options:["3.2 solar masses","0.8 solar masses","2.0 solar masses","1.4 solar masses"],correct:3,topic:"Space",explanation:"The Chandrasekhar Limit (1.4 solar masses) is the maximum mass of a stable white dwarf star. Beyond this limit, electron degeneracy pressure cannot prevent gravitational collapse."},
  {question:"What is the Golgi Apparatus's primary function in eukaryotic cells?",options:["Processing and packaging proteins and lipids for secretion or intracellular use","DNA replication and repair","ATP production via oxidative phosphorylation","Protein synthesis via mRNA translation"],correct:0,topic:"Biology",explanation:"The Golgi apparatus (or Golgi complex) functions as the cell's post office - it modifies, sorts, and packages proteins and lipids received from the ER for secretion or delivery to other organelles."},
  {question:"In which year was the first Five Year Plan of India launched and who chaired the Planning Commission?",options:["1953 - C.D. Deshmukh","1950 - B.R. Ambedkar","1952 - Sardar Patel","1951 - Jawaharlal Nehru"],correct:3,topic:"Indian History",explanation:"India's First Five Year Plan was launched in 1951, with Prime Minister Jawaharlal Nehru as the first chairman of the Planning Commission, focusing on agriculture and irrigation."},
  {question:"What is the O(n log n) sorting algorithm that uses a heap data structure?",options:["Merge Sort","Heap Sort","Quick Sort","Bubble Sort"],correct:1,topic:"Computer Science",explanation:"Heap Sort uses a binary heap data structure to sort elements. It has O(n log n) time complexity in all cases (best, average, worst), unlike Quick Sort which degrades to O(n^2) in worst case."},
  {question:"Which article of the Indian Constitution deals with the Right to Constitutional Remedies, called the 'heart and soul' of the Constitution by Ambedkar?",options:["Article 21","Article 19","Article 14","Article 32"],correct:3,topic:"Constitution",explanation:"Article 32 gives citizens the right to directly approach the Supreme Court to enforce Fundamental Rights. Dr. Ambedkar called it the 'heart and soul' of the Constitution."},
  {question:"What is the exact melting point of pure iron?",options:["1414 degrees C","1538 degrees C","1246 degrees C","1085 degrees C"],correct:1,topic:"Chemistry",explanation:"Pure iron melts at 1538 degrees Celsius (2800 degrees Fahrenheit). This high melting point makes iron and steel suitable for high-temperature industrial applications."},
  {question:"Which cognitive bias describes people's tendency to search for information confirming their pre-existing beliefs?",options:["Confirmation Bias","Anchoring Bias","Dunning-Kruger Effect","Availability Heuristic"],correct:0,topic:"Psychology",explanation:"Confirmation Bias is the tendency to search for, interpret, and recall information in a way that confirms one's pre-existing beliefs while ignoring contradictory evidence."},
  {question:"What is the primary mechanism by which Metformin reduces blood glucose in Type 2 diabetes?",options:["Stimulates glucagon secretion from alpha cells","Increases glucose absorption in intestines","Stimulates insulin secretion from beta cells","Inhibits hepatic glucose production by activating AMPK pathway"],correct:3,topic:"Biology",explanation:"Metformin primarily works by activating AMP-activated protein kinase (AMPK) in the liver, which suppresses hepatic gluconeogenesis (glucose production) and decreases intestinal glucose absorption."},
  {question:"What is the second law of thermodynamics in terms of entropy?",options:["Entropy of an isolated system never decreases, and increases in irreversible processes","All spontaneous processes are reversible","Entropy of an isolated system always decreases over time","Energy is always conserved in all processes"],correct:0,topic:"Physics",explanation:"The second law states that the total entropy of an isolated system can only remain constant (reversible) or increase (irreversible) - entropy never spontaneously decreases, explaining the arrow of time."},
  {question:"What is the time complexity of searching in a balanced Binary Search Tree?",options:["O(log n)","O(n)","O(1)","O(n log n)"],correct:0,topic:"Computer Science",explanation:"A balanced BST (like AVL or Red-Black tree) has O(log n) search time because at each node, the search space is halved. In an unbalanced tree this degrades to O(n)."}
];

var MEDIUM_QS = [
  {question:"What is the Heisenberg Uncertainty Principle and what does it state exactly?",options:["Energy is uncertain at quantum level","A particle cannot have both position and momentum defined simultaneously; their uncertainties multiply to at least h/4pi","Quantum particles exist in superposition until observed","The speed of light is the universal speed limit"],correct:1,topic:"Quantum Physics",explanation:"Heisenberg's Uncertainty Principle states that delta(x) * delta(p) >= h/4pi - the more precisely a particle's position is known, the less precisely its momentum can be known, and vice versa."},
  {question:"What is the Black-Scholes formula used to calculate?",options:["Beta coefficient of a security","Theoretical price of European call and put options on non-dividend paying stocks","Net present value of future cash flows","Expected return of a stock portfolio"],correct:1,topic:"Trading",explanation:"The Black-Scholes model (1973) provides a theoretical framework for pricing European-style options. The formula uses stock price, strike price, time to expiry, risk-free rate, and volatility."},
  {question:"What is the exact significance of the Preamble statement 'We, the People of India' in constitutional interpretation?",options:["It means Parliament is supreme","It means citizens can directly amend the constitution","It establishes parliamentary democracy as the only valid form","It indicates people are the ultimate source of constitutional authority and sovereignty"],correct:3,topic:"Constitution",explanation:"'We, the People' establishes popular sovereignty - the Constitution derives its authority from the people of India, not from any external power or parliament, making the people the ultimate sovereign."},
  {question:"In the IS-LM model, what happens to the LM curve when the central bank increases money supply?",options:["LM curve shifts left, increasing interest rates","LM curve shifts right, decreasing interest rates and increasing output","LM curve remains unchanged, only IS curve shifts","LM curve becomes vertical"],correct:1,topic:"Economics",explanation:"An increase in money supply shifts the LM curve rightward (downward) in IS-LM framework, resulting in lower interest rates and higher equilibrium income/output as money market equilibrium shifts."},
  {question:"What is the Hardy-Weinberg equilibrium and which condition is NOT required to maintain it?",options:["Frequent mutations between alleles","No natural selection acting on the alleles","Random mating within the population","No genetic drift - population must be infinitely large"],correct:0,topic:"Biology",explanation:"Hardy-Weinberg equilibrium requires: no mutation, no natural selection, random mating, no genetic drift (infinite population), no gene flow. Frequent mutation violates this - it changes allele frequencies."},
  {question:"What is the KMP (Knuth-Morris-Pratt) algorithm's time complexity for pattern matching?",options:["O(m log n)","O(n^2)","O(m*n) where m=text length, n=pattern length","O(m+n) where m=text length, n=pattern length"],correct:3,topic:"Computer Science",explanation:"KMP algorithm achieves O(m+n) time complexity using a precomputed failure function. Unlike naive O(m*n) approach, it never re-examines characters, making it optimal for pattern matching."},
  {question:"What is the Gibbs Free Energy equation and what does negative delta G signify?",options:["G = H - TS; negative G means spontaneous reaction at constant T and P","G = H/TS; negative G means reaction needs activation energy","G = U + PV; negative G means endothermic","G = H + TS; negative G means non-spontaneous"],correct:0,topic:"Chemistry",explanation:"Gibbs Free Energy G = H - TS (where H = enthalpy, T = temperature, S = entropy). A negative delta G indicates a thermodynamically spontaneous process under constant temperature and pressure."},
  {question:"What is the Transformer architecture's self-attention mechanism? What does it compute?",options:["Applies max-pooling over sequence positions","Computes weighted sum of values using dot product of queries and keys scaled by square root of dimension","Applies recurrent processing with hidden states","Computes convolutions over input sequence"],correct:1,topic:"AI",explanation:"Self-attention computes Attention(Q,K,V) = softmax(QK^T / sqrt(d_k))V - each position attends to all others by computing query-key dot products, scaled to prevent vanishing gradients, then weighting values."},
  {question:"What is the Biot-Savart Law in electromagnetism?",options:["Relates magnetic flux to changing electric field","Gives the magnetic field produced by a current-carrying conductor element","Describes electromagnetic induction","Relates electric field to charge distribution"],correct:1,topic:"Physics",explanation:"Biot-Savart Law: dB = (mu_0/4pi) * (I dl x r_hat)/r^2. It gives the infinitesimal magnetic field dB produced by an infinitesimal current element I*dl at a distance r, analogous to Coulomb's law for magnetic fields."},
  {question:"In the Accounts standard AS-16, when is borrowing cost capitalized?",options:["Borrowing costs are capitalized only if project exceeds 5 years","Only borrowing from banks can be capitalized","All borrowing costs are always expensed","Borrowing costs directly attributable to acquisition of qualifying assets are capitalized until asset is ready for intended use"],correct:3,topic:"Accounts",explanation:"AS-16 (Borrowing Costs) mandates capitalization of borrowing costs directly attributable to acquisition, construction, or production of a 'qualifying asset' - assets taking substantial time. Capitalization stops when asset is ready for use."},
  {question:"What is the significance of the Mundell-Fleming Trilemma in international economics?",options:["A country cannot simultaneously have fixed exchange rate, free capital mobility and independent monetary policy","Central banks cannot control both money supply and interest rates","Countries cannot simultaneously have high growth, low inflation and full employment","Trade deficits always lead to currency depreciation"],correct:0,topic:"Economics",explanation:"The Mundell-Fleming Trilemma (impossible trinity) states a country can only achieve 2 of 3 goals simultaneously: fixed exchange rate, free capital movement, and independent monetary policy."},
  {question:"What is the difference between Supervised and Unsupervised Learning in ML? What is K-Means?",options:["Supervised uses labeled data to learn mappings; unsupervised finds hidden patterns. K-Means is unsupervised clustering algorithm","Supervised needs labels; unsupervised doesn't. K-Means is supervised classification","Both require labeled data but K-Means uses reinforcement","Supervised and unsupervised are the same; K-Means is reinforcement learning"],correct:0,topic:"AI",explanation:"Supervised learning trains on labeled input-output pairs (classification, regression). Unsupervised learning finds structure in unlabeled data. K-Means is an unsupervised clustering algorithm that partitions data into k clusters by minimizing intra-cluster variance."},
  {question:"What is the specific constitutional provision (Article and clause) that prohibits child labour in India?",options:["Article 24","Article 19(1)(g)","Article 23(1)","Article 21A"],correct:0,topic:"Constitution",explanation:"Article 24 of the Indian Constitution prohibits employment of children below 14 years in any factory, mine, or hazardous employment. Article 21A provides free and compulsory education for children 6-14."},
  {question:"What is the time complexity of Dijkstra's shortest path algorithm using a min-heap?",options:["O(V + E)","O(V log E)","O(E log V) where E=edges and V=vertices","O(V^2)"],correct:2,topic:"Computer Science",explanation:"Dijkstra's algorithm with a binary min-heap has O((V + E) log V) complexity, often stated as O(E log V) for connected graphs. Each vertex extraction from heap costs O(log V) and each edge relaxation costs O(log V)."},
  {question:"What is the concept of 'Adverse Selection' in economics and insurance?",options:["When companies select the best employees","When investors select stocks based on inside information","When governments select industries for protection","When high-risk individuals are more likely to purchase insurance, leading to market failure"],correct:3,topic:"Economics",explanation:"Adverse selection occurs due to information asymmetry - higher-risk individuals are more likely to seek insurance than lower-risk ones. Without ability to distinguish risk types, insurers must charge average premiums, driving out low-risk customers."},
  {question:"What is the Van't Hoff Factor in colligative properties of solutions?",options:["Ratio of moles of solute to solvent","Ratio of vapor pressures of solution and solvent","Measure of osmotic pressure directly","Number of ions a solute dissociates into in solution, affecting colligative properties"],correct:3,topic:"Chemistry",explanation:"The Van't Hoff factor (i) represents the number of particles a solute dissociates into when dissolved. For NaCl, i=2 (Na+ and Cl-). It multiplies colligative property calculations: delta T_f = i*K_f*m."},
  {question:"What is the CAPM formula and what does beta represent?",options:["E(R) = Rf + beta*(Rm-Rf); beta is systematic risk measuring sensitivity of security's returns to market returns","E(R) = alpha + beta*Rf; beta is total risk","E(R) = Rm * beta/Rf; beta is unsystematic risk","E(R) = Rf + alpha*(Rm-Rf); beta is market risk"],correct:0,topic:"Trading",explanation:"Capital Asset Pricing Model: Expected Return = Risk-free rate + Beta*(Market Return - Risk-free rate). Beta measures systematic (undiversifiable) risk - how much a security's price moves relative to the overall market."},
  {question:"What is the significance of Kohlberg's Theory of Moral Development Stage 6?",options:["Following rules to avoid punishment","Social contract and utility","Universal ethical principles that transcend laws and social agreements","Following laws because they represent social contracts"],correct:2,topic:"Psychology",explanation:"Kohlberg's Stage 6 (Post-conventional) represents the highest moral development - acting according to self-chosen universal ethical principles (justice, human dignity, equality) even when they conflict with laws."},
  {question:"What is the specific mechanism of DNA replication called 'semi-conservative'?",options:["Only one strand is used as template and only one new DNA is made","Both original strands remain together and two copies are made alongside","Both strands are broken down and two completely new molecules are synthesized","Each new DNA molecule has one original and one new strand"],correct:3,topic:"Biology",explanation:"Semi-conservative replication (proved by Meselson-Stahl experiment 1958): the double helix unwinds, each original strand serves as template for a new complementary strand, producing two double helices each with one old and one new strand."},
  {question:"In Mechanical Engineering, what is the 'Modulus of Elasticity' (Young's Modulus)?",options:["Ratio of shear stress to shear strain","Ratio of tensile stress to tensile strain within elastic limit","Maximum stress a material can withstand before fracture","Energy stored per unit volume at elastic limit"],correct:1,topic:"Engineering",explanation:"Young's Modulus (E) = Stress/Strain = (F/A)/(delta_L/L) within the proportional limit. It measures a material's stiffness/resistance to elastic deformation. Steel ~200 GPa, Aluminum ~70 GPa, Rubber ~0.01-0.1 GPa."},
  {question:"What is the exact holding in the Maneka Gandhi v Union of India (1978) case?",options:["Procedure established by law must be just, fair and reasonable; expanded scope of Articles 14, 19 and 21","Right to travel abroad is not a fundamental right","Only courts can interpret Constitution","Parliament can amend any fundamental right"]  ,correct:0,topic:"Law",explanation:"Maneka Gandhi case revolutionized Article 21 interpretation - 'procedure established by law' must be fair, just and reasonable (not arbitrary). The court established interrelationship between Articles 14, 19 and 21, expanding fundamental rights protection significantly."}
];

var HARD_QS = [
  {question:"What is the exact statement of the Riemann Hypothesis and why is it unsolved?",options:["Every even integer greater than 2 is sum of two primes","Non-trivial zeros of Riemann zeta function lie on critical line Re(s)=1/2","All prime numbers are odd","There are infinitely many twin primes"],correct:1,topic:"Mathematics",explanation:"The Riemann Hypothesis conjectures that all non-trivial zeros of the Riemann zeta function zeta(s) have real part 1/2. Unsolved since 1859, it has deep implications for prime number distribution. It's one of the Millennium Prize Problems worth $1 million."},
  {question:"What is the exact mechanism of CRISPR-Cas9 gene editing at the molecular level?",options:["Cas9 uses RNA interference to silence genes","Cas9 inserts new DNA without cutting existing sequence","Cas9 methylates target DNA preventing transcription","Guide RNA directs Cas9 endonuclease to specific DNA sequence where it creates double-strand break; repair mechanisms then edit the sequence"],correct:3,topic:"Biology",explanation:"CRISPR-Cas9: guide RNA (gRNA) complementary to target sequence forms complex with Cas9 protein; Cas9 unwinds DNA and creates double-strand break at precise location; cell repairs via NHEJ (causing insertions/deletions) or HDR (allowing precise editing)."},
  {question:"In quantum field theory, what does the Dirac Equation describe that Schrodinger's equation does not?",options:["Relativistic quantum mechanics of spin-1/2 particles, predicting antimatter and electron spin naturally","Wave-particle duality at atomic scale","Many-body quantum systems","Tunneling probability through potential barriers"],correct:0,topic:"Quantum Physics",explanation:"Dirac's equation (1928) combines special relativity with quantum mechanics for spin-1/2 particles. Unlike non-relativistic Schrodinger equation, it naturally predicts electron spin, magnetic moment, and antimatter (positron) - confirmed by Anderson in 1932."},
  {question:"What is the exact condition for NP-completeness and give an example?",options:["Problems with polynomial space complexity","Problems requiring exponential time to solve and verify","Problems where solution can be verified in polynomial time AND every NP problem reduces to it; example: 3-SAT or Travelling Salesman","Problems solvable in polynomial time"],correct:2,topic:"Computer Science",explanation:"NP-complete: problems in NP (solution verifiable in polynomial time) to which all NP problems reduce in polynomial time. Cook's theorem (1971) proved SAT is NP-complete. TSP, graph coloring, clique problems are NP-complete. If P=NP, all would be polynomial-solvable."},
  {question:"What is the Tolman-Oppenheimer-Volkoff (TOV) limit in astrophysics?",options:["Minimum mass of a black hole","Maximum mass of a white dwarf star","Maximum mass of a neutron star before collapsing into a black hole, approximately 0.7-3 solar masses","Minimum mass required for nuclear fusion in stars"],correct:2,topic:"Space",explanation:"The TOV limit (1939) is the maximum mass a neutron star can have, supported by neutron degeneracy pressure. Beyond ~0.7-3 solar masses (exact value uncertain due to dense matter equations), gravitational collapse forms a black hole."},
  {question:"What is the specific mechanism of ATP synthesis in the mitochondria via chemiosmosis?",options:["ATP synthase uses direct chemical reactions between ADP and phosphate","Calcium ions directly phosphorylate ADP to form ATP","Proton gradient created by electron transport chain drives ATP synthase's F0 rotor; rotation of F1 causes conformational changes in beta subunits catalyzing ATP synthesis","ATP is synthesized directly from glucose in the matrix"],correct:2,topic:"Biology",explanation:"Mitchell's chemiosmosis: ETC pumps H+ across inner membrane creating proton motive force; H+ flows back through ATP synthase's F0 (transmembrane) domain causing rotation; mechanical energy transmitted to F1 domain causes beta subunits to cycle through open-loose-tight conformations, synthesizing ATP from ADP+Pi."},
  {question:"What is the exact holding of the Kesavananda Bharati case (1973) regarding Parliament's amendment power?",options:["Parliament can amend fundamental rights completely","Parliament has unlimited power to amend Constitution","Only Supreme Court can amend Constitution","Parliament can amend any part of Constitution but cannot alter or destroy its Basic Structure"],correct:3,topic:"Law",explanation:"By 7:6 majority, the Supreme Court held Parliament has wide amending power under Article 368 but cannot alter the 'Basic Structure' of the Constitution. Basic structure includes supremacy of Constitution, republican democratic form, separation of powers, judicial review, and fundamental rights."},
  {question:"What is the Shannon-Hartley theorem and what is the significance of channel capacity C?",options:["C = B * SNR; capacity grows linearly with bandwidth","C = log2(B*S/N); capacity depends only on SNR","C = B * log2(1 + S/N); maximum error-free information rate through channel with bandwidth B and signal-to-noise ratio S/N","C = B^2 / N; capacity is limited only by noise"],correct:2,topic:"Computer Science",explanation:"Shannon-Hartley theorem: C = B*log2(1 + S/N) bits per second. It gives the theoretical maximum rate at which error-free information can be transmitted over a channel with bandwidth B Hz and SNR S/N. This is Shannon's capacity limit - no code can exceed it."},
  {question:"What is the mechanism of action of beta-lactam antibiotics like Penicillin?",options:["Inhibit DNA gyrase preventing DNA replication","Inhibit transpeptidase enzyme preventing cross-linking of peptidoglycan cell wall, causing bacterial lysis","Disrupt cell membrane by creating ion channels","Inhibit protein synthesis by binding 30S ribosomal subunit"],correct:1,topic:"Biology",explanation:"Beta-lactam antibiotics contain the beta-lactam ring that irreversibly binds to transpeptidase (penicillin-binding proteins/PBPs), blocking the final cross-linking step of peptidoglycan synthesis. Without cross-linking, the bacterial cell wall becomes structurally weak and bacteria lyse due to osmotic pressure."},
  {question:"What is the exact content of the Demotion Rule in Indian Administrative Service rules regarding seniority?",options:["Central deputation is mandatory after 9 years","An officer of higher batch can be superseded in promotion if two lower batch officers of the same state cadre are promoted ahead","IAS officers cannot be demoted for 5 years","Seniority is determined only by year of allotment"],correct:1,topic:"Law",explanation:"Under IAS Seniority Rules, if two officers of the same state cadre belonging to junior batches are promoted ahead of a senior batch officer for two consecutive years, the senior officer is 'deemed superseded' and loses seniority for future promotions. This discourages stagnation."},
  {question:"What is the exact formula for the Nernst Equation and what does E represent?",options:["E = E0 + (RT/nF)ln([products]/[reactants])","E = E0 - (RT/nF)ln([products]/[reactants]); E is cell potential under non-standard conditions","E = E0 * pH","E = -deltaG/nF only at standard conditions"],correct:1,topic:"Chemistry",explanation:"Nernst Equation: E = E0 - (RT/nF)ln(Q) where E0=standard potential, R=gas constant, T=temperature, n=electrons transferred, F=Faraday constant, Q=reaction quotient. At 25C: E = E0 - (0.0592/n)log(Q). It calculates cell potential at any concentration."},
  {question:"In reinforcement learning, what is the Bellman Equation for Q-learning?",options:["Q(s,a) = R(s,a) only","Q(s,a) = R(s,a) + gamma * max_a'[Q(s',a')]; discounted future value of best action in next state","Q(s,a) = sum of all past rewards","Q(s,a) = probability of action a in state s"],correct:1,topic:"AI",explanation:"Bellman optimality equation for Q-learning: Q*(s,a) = E[r + gamma*max_a'Q*(s',a')]. The optimal Q-value equals immediate reward r plus discounted (gamma) maximum Q-value achievable from next state s'. TD learning updates: Q(s,a) += alpha[r + gamma*max Q(s',a') - Q(s,a)]."},
  {question:"What is the Bode plot and what do gain margin and phase margin indicate?",options:["Time-domain response plot; margins indicate stability duration","Displacement vs velocity plot; margins indicate resonance","Frequency response plots of gain and phase vs frequency; gain margin is gain at phase crossover frequency, phase margin is phase at gain crossover - both measure stability robustness","Root locus plot; margins indicate pole locations"],correct:2,topic:"Engineering",explanation:"Bode plots show system's frequency response: gain (dB) and phase (degrees) vs log frequency. Gain margin = 1/|G(jwpc)| at phase crossover (phase=-180 deg). Phase margin = 180 + phase at gain crossover (|G|=1). Positive margins indicate stable system; larger margins mean greater stability robustness."},
  {question:"What is the exact significance of the Preamble's phrase 'Sovereign Democratic Republic' being changed to 'Sovereign Socialist Secular Democratic Republic' and when?",options:["Changed in 52nd Amendment 1985 to prevent defection","Changed in 42nd Amendment 1976 during Emergency to add secular and socialist principles; controversial as it was passed during Emergency with many opposition MPs in jail","Changed in 44th Amendment 1978 to reflect Bangladesh independence","Changed in 61st Amendment 1989 to lower voting age"],correct:1,topic:"Constitution",explanation:"The 42nd Constitutional Amendment (1976) during Indira Gandhi's Emergency added 'Socialist' and 'Secular' to the Preamble and 'Integrity' after 'Unity'. Highly controversial as it was enacted with suspended rights, imprisoned opposition, and press censorship. Some argue these were already implicit in the Constitution."},
  {question:"What does the Efficient Market Hypothesis (EMH) state in its strong form?",options:["Markets always correctly price securities","Prices reflect all publicly available information only","All information - public, private and insider - is already reflected in stock prices making it impossible to consistently outperform market","Markets are efficient only in the long run"],correct:2,topic:"Trading",explanation:"Strong form EMH states all information - past prices, public information, and private/insider information - is fully incorporated into current prices. This would make insider trading useless. Evidence against: insider trading prosecution cases show insiders do make abnormal profits, suggesting strong form doesn't hold."},
  {question:"What is the exact legal test established in R v McNaughten (1843) for criminal insanity defense?",options:["Defendant was unaware of consequences of their actions","At time of crime, defendant suffered such defect of reason from disease of mind that they didn't know nature of act OR didn't know it was wrong","Court must prove premeditation beyond reasonable doubt","Defendant must prove mental illness diagnosed at time of act"],correct:1,topic:"Law",explanation:"M'Naghten Rules (1843): defense of insanity requires proving that at time of the act, accused was under such defect of reason from disease of the mind that they either didn't know the nature/quality of the act OR didn't know what they were doing was wrong. This test was adopted in Indian law under Section 84 IPC."},
  {question:"In the context of Machine Learning, what is the 'Vanishing Gradient Problem' and which architecture solved it?",options:["Gradients oscillate preventing convergence; solved by momentum","Only affects CNN not RNN; solved by max pooling","Gradients become too large during backpropagation; solved by dropout","In deep networks, gradients of early layers approach zero during backpropagation making training impossible; solved by LSTM and ResNet with skip connections"],correct:3,topic:"AI",explanation:"Vanishing gradients occur in deep networks when backpropagation multiplies many small gradient values (from sigmoid/tanh), causing gradients to approach zero in early layers - preventing learning. Solutions: LSTM (gating mechanisms preserve gradients in RNNs), ResNet skip/residual connections (direct gradient flow), ReLU activations, batch normalization."},
  {question:"What is the Heliocentric model's specific prediction tested by Foucault's Pendulum?",options:["Speed of Earth's rotation decreases over time","Earth rotates on its axis - pendulum's plane of swing appears to rotate relative to observer due to Earth's rotation beneath it","Earth's axial tilt causes seasons","Earth revolves around sun in elliptical orbit"],correct:1,topic:"Physics",explanation:"Foucault's Pendulum (Paris, 1851) demonstrated Earth's rotation: a long pendulum's swing plane remains fixed relative to stars while Earth rotates beneath it. The pendulum appears to slowly rotate - completing one full rotation in 24/sin(latitude) hours. At North Pole it rotates once per 24 hours."},
  {question:"What is the exact purpose of the 'virtual memory' concept in operating systems?",options:["Increases RAM speed by caching frequently used data","Creates illusion of larger RAM by using disk as secondary storage; uses page tables and TLB for address translation enabling process isolation","Allows multiple CPUs to share memory","Encrypts memory contents for security"],correct:1,topic:"Computer Science",explanation:"Virtual memory creates an abstraction where each process has its own large address space independent of physical RAM. Pages of virtual memory are mapped to physical frames via page tables; infrequently used pages are swapped to disk. TLB caches recent translations for speed. Enables memory isolation, larger effective memory, and simplified memory management."},
  {question:"What is the specific holding of the S.R. Bommai case (1994) regarding Article 356?",options:["Article 356 cannot be used at all","Supreme Court can review imposition of President's Rule; floor test is mandatory before dismissing state government; Article 356 cannot be used for political reasons","States have absolute right to governance and Centre cannot interfere","President's Rule is fully justified whenever Governor recommends"],correct:1,topic:"Law",explanation:"S.R. Bommai v Union of India (1994) 9-judge bench: (1) President's Rule under Article 356 is justiciable and subject to judicial review; (2) Before dismissing a government, the majority must be tested on the floor of the Assembly; (3) Courts can restore dismissed governments; (4) Article 356 cannot be used for political/mala fide reasons. This significantly curbed misuse of Article 356."},
  {question:"What is the exact significance of P value in hypothesis testing and what does p<0.05 mean?",options:["Probability that the null hypothesis is true","Probability that the alternative hypothesis is true","Confidence level of the statistical test","Probability of obtaining results at least as extreme as observed, assuming null hypothesis is true; p<0.05 means less than 5% chance of observing data if null hypothesis were true"],correct:3,topic:"Mathematics",explanation:"P-value is the probability of observing results at least as extreme as your data if the null hypothesis (H0) were true. p<0.05 means: if H0 is true, there's less than 5% probability of seeing this result by chance. We reject H0 not because we proved it false, but because the data is sufficiently improbable under H0. NOT the probability H0 is true."}
];


var FFF_QS = [
  // Science & Nature
  {question:"Arrange these planets in order from closest to the Sun:",options:["Earth","Mars","Mercury","Venus"],correctOrder:[2,3,0,1],explanation:"Mercury is 1st, Venus 2nd, Earth 3rd, Mars 4th from the Sun."},
  {question:"Arrange these animals by average lifespan from shortest to longest:",options:["Dog","Elephant","Tortoise","Human"],correctOrder:[0,3,1,2],explanation:"Dog (~12 yrs), Human (~72 yrs), Elephant (~70 yrs), Tortoise (~150 yrs)."},
  {question:"Arrange these from smallest to largest in size:",options:["Atom","Cell","Molecule","Virus"],correctOrder:[0,2,3,1],explanation:"Atom < Molecule < Virus < Cell in increasing size."},
  {question:"Arrange these in the water cycle order:",options:["Precipitation","Evaporation","Cloud formation","Runoff"],correctOrder:[1,2,0,3],explanation:"Water evaporates, forms clouds, falls as precipitation, then runs off."},

  // Geography & World
  {question:"Arrange these continents from largest to smallest by area:",options:["Europe","Asia","Africa","Australia"],correctOrder:[1,2,0,3],explanation:"Asia is largest, then Africa, then Europe, then Australia (smallest)."},
  {question:"Arrange these countries by population from smallest to largest:",options:["India","China","USA","Brazil"],correctOrder:[3,2,0,1],explanation:"Brazil, USA, India, China in ascending population order."},
  {question:"Arrange these oceans from smallest to largest:",options:["Atlantic","Pacific","Arctic","Indian"],correctOrder:[2,3,0,1],explanation:"Arctic is smallest, then Indian, then Atlantic, then Pacific (largest)."},
  {question:"Arrange these Indian cities from south to north:",options:["Delhi","Chennai","Mumbai","Kolkata"],correctOrder:[1,2,3,0],explanation:"Chennai is southernmost, then Mumbai, then Kolkata, then Delhi is northernmost."},

  // Sports & Games
  {question:"Arrange these cricket formats by match duration (shortest first):",options:["Test Match","One Day International","T20","The Hundred"],correctOrder:[2,3,1,0],explanation:"T20 (20 overs), The Hundred, ODI (50 overs), Test Match (up to 5 days)."},
  {question:"Arrange these Olympic sports in alphabetical order:",options:["Wrestling","Archery","Swimming","Gymnastics"],correctOrder:[1,3,2,0],explanation:"Archery, Gymnastics, Swimming, Wrestling."},
  {question:"Arrange these sports by number of players per team (fewest to most):",options:["Cricket","Tennis singles","Football","Basketball"],correctOrder:[1,3,2,0],explanation:"Tennis (1), Basketball (5), Football (11), Cricket (11) - same as football."},

  // Food & Daily Life
  {question:"Arrange these meals in the order they are typically eaten in a day:",options:["Dinner","Breakfast","Lunch","Evening snack"],correctOrder:[1,2,3,0],explanation:"Breakfast, Lunch, Evening snack, Dinner is the typical daily meal order."},
  {question:"Arrange these fruits by sweetness from least to most sweet (generally):",options:["Lemon","Apple","Banana","Watermelon"],correctOrder:[0,3,1,2],explanation:"Lemon is least sweet, then Watermelon, Apple, Banana is generally sweetest."},

  // Technology & Science
  {question:"Arrange these data units from smallest to largest:",options:["Megabyte","Gigabyte","Kilobyte","Terabyte"],correctOrder:[2,0,1,3],explanation:"Kilobyte < Megabyte < Gigabyte < Terabyte."},
  {question:"Arrange these inventions in order from oldest to newest:",options:["Telephone","Printing Press","Internet","Electricity harnessed"],correctOrder:[1,3,0,2],explanation:"Printing Press (1440), Electricity (1800s), Telephone (1876), Internet (1990s)."},
  {question:"Arrange these colours in the order they appear in a rainbow:",options:["Green","Red","Violet","Yellow"],correctOrder:[1,3,0,2],explanation:"ROYGBIV: Red, Orange, Yellow, Green, Blue, Indigo, Violet."},

  // Numbers & Common Sense
  {question:"Arrange these time units from shortest to longest:",options:["Minute","Second","Hour","Day"],correctOrder:[1,0,2,3],explanation:"Second < Minute < Hour < Day."},
  {question:"Arrange these coins/notes in increasing denomination (Indian currency):",options:["Rs. 10 note","50 paise","Rs. 100 note","Rs. 2 coin"],correctOrder:[1,3,0,2],explanation:"50 paise, Rs. 2, Rs. 10, Rs. 100 in ascending order."},
  {question:"Arrange these school classes in ascending order:",options:["Class 8","Class 5","Class 10","Class 12"],correctOrder:[1,0,2,3],explanation:"Class 5, Class 8, Class 10, Class 12 in ascending order."},
  {question:"Arrange these seasons in the order they occur in India (starting from summer):",options:["Monsoon","Winter","Summer","Post-Monsoon"],correctOrder:[2,0,3,1],explanation:"Summer, Monsoon, Post-Monsoon (Autumn), Winter is India's seasonal cycle."},

  // Health & Body
  {question:"Arrange these stages of human life from youngest to oldest:",options:["Middle age","Childhood","Old age","Adolescence"],correctOrder:[1,3,0,2],explanation:"Childhood, Adolescence, Middle age, Old age."},
  {question:"Arrange these bones from largest to smallest:",options:["Fibula","Femur","Tibia","Patella"],correctOrder:[1,2,0,3],explanation:"Femur (thigh) is largest, then Tibia, Fibula, Patella (kneecap) is smallest."},

  // General Knowledge
  {question:"Arrange these planets by number of moons (fewest to most):",options:["Mars","Earth","Jupiter","Saturn"],correctOrder:[1,0,2,3],explanation:"Earth has 1 moon, Mars has 2, Jupiter has ~95, Saturn has ~146 moons."},
  {question:"Arrange these in order of distance from Earth (nearest first):",options:["Andromeda Galaxy","Moon","Sun","Mars"],correctOrder:[1,2,3,0],explanation:"Moon is nearest, then Sun, then Mars, then Andromeda Galaxy is farthest."},
  {question:"Arrange these items by weight from lightest to heaviest:",options:["Car","Feather","Elephant","Human"],correctOrder:[1,3,2,0],explanation:"Feather < Human < Elephant < Car in ascending weight order."},
];

// ============================================================
// ANTI-REPEAT QUESTION SYSTEM
// Layer 1: _sessionUsed  - tracks questions used IN THIS game (resets each new game)
// Layer 2: _globalUsed   - tracks ALL questions ever shown across all sessions
//                          resets only when entire pool is exhausted
// Both layers use question TEXT (not index) so repeats are impossible
// ============================================================

// ============================================================
// PERSISTENT ANTI-REPEAT QUESTION SYSTEM
// Uses localStorage to remember every question ever shown.
// Questions never repeat until entire pool is exhausted.
// Survives page refresh, browser close, app restart.
// ============================================================
var LS_KEY = "kbg_used_questions";

function loadUsedFromStorage() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { easy: [], medium: [], hard: [], fff: [] };
}

function saveUsedToStorage(used) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(used)); } catch(e) {}
}

// _persistUsed: loaded from localStorage, saved back after every pick
var _persistUsed = loadUsedFromStorage();

// _sessionUsed: only within this game session (cleared on new game)
var _sessionUsed = { easy: [], medium: [], hard: [] };

function resetUsedQuestions() {
  // Only reset session tracker - persistent tracker keeps memory across games
  _sessionUsed = { easy: [], medium: [], hard: [] };
}

function pickQuestion(pool, sessionList, persistList, storageKey) {
  // Step 1: remove questions seen THIS game
  var notSession = pool.filter(function(q) {
    return sessionList.indexOf(q.question) < 0;
  });
  // Step 2: from those, remove questions seen in ANY previous game
  var fresh = notSession.filter(function(q) {
    return persistList.indexOf(q.question) < 0;
  });
  // Step 3: if all exhausted across all games, reset persistent list for this pool
  if (fresh.length === 0) {
    _persistUsed[storageKey] = [];
    persistList.length = 0;
    saveUsedToStorage(_persistUsed);
    fresh = notSession.length > 0 ? notSession : pool.slice();
  }
  if (fresh.length === 0) fresh = pool.slice();

  // Step 4: shuffle and pick
  fresh = fresh.slice().sort(function() { return Math.random() - 0.5; });
  var picked = fresh[0];

  // Save to both session and persistent trackers
  sessionList.push(picked.question);
  persistList.push(picked.question);
  _persistUsed[storageKey] = persistList.slice();
  saveUsedToStorage(_persistUsed);

  return Object.assign({}, picked);
}

function getOfflineQ(idx) {
  var pool = idx < 5 ? EASY_QS : idx < 10 ? MEDIUM_QS : HARD_QS;
  var key  = idx < 5 ? "easy"  : idx < 10 ? "medium"  : "hard";
  var q = pickQuestion(pool, _sessionUsed[key], _persistUsed[key], key);
  // Always re-shuffle correct answer position before returning
  if (q && Array.isArray(q.options) && q.options.length === 4) {
    var correctAns = q.options[q.correct];
    var wrongs = q.options.filter(function(_, i) { return i !== q.correct; });
    // Fisher-Yates shuffle wrongs
    for (var i = wrongs.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = wrongs[i]; wrongs[i] = wrongs[j]; wrongs[j] = t;
    }
    var newPos = Math.floor(Math.random() * 4);
    var newOpts = [];
    var wi = 0;
    for (var k = 0; k < 4; k++) {
      if (k === newPos) newOpts.push(correctAns);
      else newOpts.push(wrongs[wi++]);
    }
    q.options = newOpts;
    q.correct = newPos;
  }
  return q;
}

function getOfflineFFF() {
  // FFF only uses persistent tracker (no session - only 1 FFF per game anyway)
  var available = FFF_QS.filter(function(q) {
    return _persistUsed.fff.indexOf(q.question) < 0;
  });
  if (available.length === 0) {
    _persistUsed.fff = [];
    saveUsedToStorage(_persistUsed);
    available = FFF_QS.slice();
  }
  available = available.slice().sort(function() { return Math.random() - 0.5; });
  var picked = available[0];
  _persistUsed.fff.push(picked.question);
  saveUsedToStorage(_persistUsed);
  return Object.assign({}, picked);
}


function getOfflineHindi(q) {
  if (HINDI_MAP[q.question]) {
    return { question: HINDI_MAP[q.question].question, options: HINDI_MAP[q.question].options, explanation: HINDI_MAP[q.question].explanation };
  }
  // Generic Hindi translation fallback structure
  return {
    question: q.question + " (Hindi translation unavailable offline)",
    options: q.options,
    explanation: q.explanation
  };
}

function getOfflineExpert(question, opts, correct) {
  // Smart expert hint based on actual question and correct answer
  var correctOpt = opts[correct];
  var labels = ["A","B","C","D"];
  var correctLabel = labels[correct];

  // Generate misleading-but-helpful expert phrases
  var openings = [
    "Looking at this question carefully,",
    "This is an interesting one.",
    "I have studied this topic extensively.",
    "Based on my knowledge of this subject,",
    "After analyzing all the options,"
  ];
  var middles = [
    "I would strongly lean towards option " + correctLabel + ".",
    "option " + correctLabel + " stands out as the most likely correct answer.",
    "I believe the answer is " + correctLabel + " - " + correctOpt + ".",
    "my best advice would be to go with " + correctLabel + ".",
    "option " + correctLabel + " seems the most accurate to me."
  ];
  var closings = [
    "The other options seem designed to mislead. Trust your instincts on this one.",
    "I am fairly confident about this, but the final decision is yours.",
    "This aligns with what I recall from my studies on this subject.",
    "The phrasing of the question points toward this answer.",
    "I have seen similar questions before and this is typically the right answer."
  ];

  var o = openings[Math.floor(Math.random() * openings.length)];
  var m = middles[Math.floor(Math.random() * middles.length)];
  var c = closings[Math.floor(Math.random() * closings.length)];
  return o + " " + m + " " + c;
}

// ============================================================
// API-POWERED QUESTION GENERATION - Infinite unique questions
// Every game generates brand new questions via Anthropic API
// Falls back to offline bank if API unavailable
// ============================================================

var TOPICS_BY_LEVEL = {
  easy: [
    // === GS: HISTORY ===
    "Ancient India - Ramayana Mahabharata epics characters events moral lessons",
    "Ancient India - Hindu deities Vishnu Shiva Brahma Durga mythology stories",
    "Ancient India - Indus Valley Harappa Mohenjo-daro artifacts trade",
    "Ancient India - Vedic period Upanishads four Vedas Rig Sama Yajur Atharva",
    "Ancient India - Mauryan empire Ashoka edicts Buddhism spread",
    "Medieval India - Mughal Empire Akbar Humayun Babur Aurangzeb facts",
    "Medieval India - Rajput kingdoms battles forts architecture",
    "Modern India - 1857 revolt causes leaders sepoy mutiny regions",
    "Modern India - Indian National Congress Gandhi Nehru Subhas Bose freedom",
    "Modern India - Partition 1947 independence leaders events dates",
    "World History - French Revolution causes Bastille Napoleon events",
    "World History - World War I causes allied axis powers key events",
    "World History - World War II Holocaust UN formation atomic bombs",
    // === GS: GEOGRAPHY ===
    "Indian Geography - rivers Ganga Yamuna Brahmaputra Krishna Godavari facts",
    "Indian Geography - mountains Himalayas Vindhyas Western Ghats Eastern Ghats",
    "Indian Geography - states capitals languages famous landmarks Taj Mahal",
    "Indian Geography - India Gate Red Fort Qutub Minar historical monuments",
    "Indian Geography - national parks wildlife sanctuaries tigers lions facts",
    "World Geography - continents oceans largest countries capitals flags",
    "World Geography - rivers Amazon Nile Mississippi Yangtze facts",
    "Geography - climate zones monsoon rainfall seasons Indian agriculture",
    // === GS: POLITY & CONSTITUTION ===
    "Indian Constitution - Preamble Fundamental Rights Articles key provisions",
    "Indian Polity - Parliament Lok Sabha Rajya Sabha President PM functions",
    "Indian Polity - Supreme Court High Court judicial system structure",
    "Governance - Panchayati Raj local self-government village administration",
    // === GS: ECONOMY ===
    "Indian Economy - famous entrepreneurs Tata Ambani Infosys Wipro founders",
    "Indian Economy - famous brands Made in India success stories",
    "Indian Economy - RBI SEBI NITI Aayog budget schemes basic",
    "International Organisations - BRICS G20 WTO IMF World Bank SAARC ASEAN",
    // === GS: ENVIRONMENT & SCIENCE ===
    "Environment - biodiversity ecosystems national parks flora fauna India",
    "General Science - human anatomy organs diseases health basic biology",
    "General Science - plants animals species food chains ecology basic",
    "General Science - ISRO NASA space missions planets satellites discoveries",
    "General Science - physics chemistry biology class 10 to 12 concepts",
    // === ENTERTAINMENT & SPORTS ===
    "Bollywood - iconic actors Shah Rukh Salman Aamir roles famous films",
    "Bollywood - iconic actresses Deepika Alia Priyanka Kareena famous roles",
    "Bollywood - famous songs fill in the blank lyrics dialogues",
    "Bollywood - recent films 2020-2024 hits directors box office",
    "Hollywood - Marvel DC superhero films actors storylines",
    "Hollywood - famous films actors directors Oscars recent",
    "Cricket - IPL teams records players auction prices season winners",
    "Cricket - India World Cup records centuries wickets famous matches",
    "Sports - Olympics India medals Neeraj Chopra PV Sindhu records",
    "Sports - Football FIFA Messi Ronaldo World Cup ISL India facts",
    "Sports - Kabaddi Kho-Kho traditional Indian games rules players",
    // === LANGUAGE & CULTURE ===
    "Hindi Language - idioms proverbs meanings famous poets Kabir Mirabai",
    "Indian Festivals - Diwali Holi Eid Christmas Navratri significance dates",
    "Indian Mythology - Ramayana Sita Ram Hanuman Ravana Lanka stories",
    "Indian Mythology - Mahabharata Pandavas Kauravas Krishna Arjuna facts",
    // === CSAT BASIC ===
    "Aptitude Basic - percentages profit loss simple interest class 10",
    "Aptitude Basic - time work speed distance ratio proportion class 10",
    "Logical Reasoning - series patterns odd one out basic analogies",
    "Current Affairs 2024 - major events awards summits government schemes"
  ],
  medium: [
    // === GS1: HISTORY DEEP ===
    "Ancient India - Sangam literature Tamil Chera Chola Pandya kingdoms culture",
    "Ancient India - Gupta period golden age art science mathematics Aryabhatta",
    "Ancient India - Buddhism Jainism Theravada Mahayana spread Asia",
    "Medieval India - Bhakti movement Tukaram Kabir Mirabai Chaitanya saints",
    "Medieval India - Sufi movement Chishti Suhrawardi orders saints music",
    "Medieval India - land revenue Todar Mal Mansabdari Jagirdari systems",
    "Modern India - socio-religious reforms Brahmo Samaj Arya Samaj Vivekananda",
    "Modern India - Non-Cooperation movement 1920 events participants results",
    "Modern India - Civil Disobedience Dandi March Salt Satyagraha",
    "Modern India - Quit India Movement 1942 underground activities leaders",
    "World History - decolonization Africa Asia nationalist leaders movements",
    "World History - Cold War proxy wars Korean Vietnam Cuban missile crisis",
    "World History - formation of UN Bretton Woods IMF World Bank GATT",
    // === GS1: GEOGRAPHY DEEP ===
    "Indian Heritage - UNESCO World Heritage Sites India monuments caves temples",
    "Indian Society - caste system social stratification reform movements",
    "Indian Society - tribal communities PVTG scheduled areas 5th 6th Schedule",
    "Indian Society - gender inequality female literacy empowerment data",
    "Geography - plate tectonics earthquakes volcanoes formation rivers",
    "Geography - ocean currents tides coral reefs wetlands Ramsar sites",
    "Geography - Indian agriculture cropping patterns Green Revolution issues",
    "Geography - natural resources minerals coal petroleum distribution India",
    // === GS2: POLITY DEEP ===
    "Polity - Federalism Centre-State relations Article 356 Governor President",
    "Polity - Emergency provisions Articles 352 356 360 historical uses",
    "Polity - Constitutional Amendments 42nd 44th 73rd 74th 86th key",
    "Polity - Fundamental Rights restrictions reasonable nexus Article 19",
    "Polity - DPSP Article 37-51 state policy conflict with Fundamental Rights",
    "Polity - CAG UPSC Election Commission Finance Commission functions",
    "Governance - RTI Act 2005 provisions exemptions CIC enforcement cases",
    "Governance - Digital India PM Gati Shakti Smart Cities e-governance",
    "Social Justice - SC ST OBC reservation Mandal Commission Indra Sawhney",
    "Social Justice - MGNREGA right to food education health entitlements",
    "Social Justice - women laws POCSO Domestic Violence Act Maternity Benefit",
    "International Relations - India bilateral China Pakistan US Russia ties",
    "International Relations - India-China LAC border disputes history",
    "International Relations - Quad AUKUS Pacific strategy India role",
    "International Relations - WTO RCEP CPTPP trade agreements India",
    // === GS3: ECONOMY DEEP ===
    "Economy - monetary policy RBI repo reverse repo CRR SLR inflation targeting",
    "Economy - fiscal policy FRBM deficit direct indirect taxes GST structure",
    "Economy - balance of payments current account capital account forex",
    "Economy - agriculture MSP procurement APMC reforms food security",
    "Economy - startup ecosystem unicorns venture capital Indian entrepreneurs",
    // === GS3: SCIENCE & TECH ===
    "Science Tech - AI machine learning deep learning applications use cases",
    "Science Tech - biotechnology genome CRISPR medical applications ethics",
    "Science Tech - ISRO Chandrayaan Mangalyaan Aditya missions details",
    "Science Tech - nuclear energy thorium reactor India nuclear policy",
    "Science Tech - cybersecurity data protection IT Act provisions India",
    "Science Tech - 5G telecom internet of things smart technology India",
    "Science Tech - electric vehicles battery technology green hydrogen",
    // === GS3: ENVIRONMENT DEEP ===
    "Environment - Paris Agreement COP NDC targets India commitments",
    "Environment - biodiversity hotspots India CBD Nagoya Protocol",
    "Environment - NGT pollution laws Environment Protection Act cases",
    "Environment - disaster management NDMA flood drought earthquake cyclone",
    "Environment - internal security naxalism AFSPA cyber threats borders",
    // === GS4: ETHICS ===
    "Ethics - emotional intelligence empathy attitude values concepts",
    "Ethics - public service values integrity probity governance India",
    "Ethics - Gandhian philosophy Sarvodaya Antyodaya trusteeship",
    "Ethics - Kant Bentham Mill Rawls ethical theories comparison",
    "Ethics - case study administrative dilemma conflict of interest",
    // === CSAT MEDIUM ===
    "CSAT - syllogisms deductive reasoning venn diagrams conclusions",
    "CSAT - data interpretation bar graph line chart table pie chart",
    "CSAT - seating arrangement puzzles blood relations complex",
    "CSAT - reading comprehension inference assumption conclusion",
    "CSAT - decision making administrative situation ethical choice",
    // === OPTIONAL: HUMANITIES ===
    "Sociology - caste class gender institutions social mobility Ambedkar",
    "Political Science - democracy theories federalism IR realism liberalism",
    "Philosophy - Indian philosophy Vedanta Nyaya Vaisheshika Samkhya",
    "Philosophy - Western philosophy Plato Aristotle Kant existentialism",
    "Public Administration - bureaucracy governance NPM Weber theories",
    "History Optional - detailed analysis key events rulers policies India",
    "Geography Optional - geomorphology climatology oceanography India",
    // === OPTIONAL: SCIENCE & ENGINEERING ===
    "Mathematics - calculus derivatives integrals differential equations",
    "Mathematics - linear algebra probability statistics number theory",
    "Physics - electromagnetism thermodynamics modern physics concepts",
    "Chemistry - organic reactions inorganic coordination chemistry",
    "Civil Engineering - structural analysis RCC soil mechanics foundation",
    "Mechanical Engineering - thermodynamics fluid mechanics machine design",
    "Electrical Engineering - circuits power systems control electronics",
    "Computer Science - DSA operating systems DBMS computer networks",
    "Medical Science - human physiology pathology pharmacology diseases",
    // === OPTIONAL: LITERATURE ===
    "Hindi Literature - Premchand Nirala Jaishankar Prasad Kabir poetry prose",
    "English Literature - Shakespeare Dickens Hardy Tagore Indian English",
    "Sanskrit Literature - Kalidasa Panini Aryabhatta Chanakya works",
    "Tamil Literature - Sangam poetry Thirukkural Silappadikaram classics",
    // === ENTERTAINMENT MEDIUM ===
    "Bollywood - National Award winners best film actor actress director",
    "Bollywood - box office records 100cr 500cr Aamir Shah Rukh comparisons",
    "Bollywood - music composers lyricists singers playback history",
    "Sports - cricket exact batting bowling records Sachin Kohli statistics",
    "Sports - Olympics world records track field swimming gymnastics",
    "Indian Mythology Medium - lesser known stories Puranas Upanishads"
  ],
  hard: [
    // === UPSC MAINS DEEP: HISTORY ===
    "History - Kautilya Arthashastra seven elements state philosophy comparison",
    "History - Ashoka's Dhamma edicts inscriptions pillar rock interpretation",
    "History - Arab invasion Sind 712 AD Muhammad bin Qasim significance",
    "History - Permanent Settlement 1793 effects Ryotwari Mahalwari comparison",
    "History - INC moderate extremist split Surat 1907 causes aftermath",
    "History - Cabinet Mission Plan 1946 provisions Mountbatten acceptance",
    "History - Treaty of Versailles war guilt reparations consequences WWII",
    "History - Bretton Woods 1944 IMF IBRD GATT formation implications",
    // === UPSC MAINS: POLITY DEEP ===
    "Polity - Kesavananda Bharati 1973 13 judges Basic Structure components",
    "Polity - Article 370 abrogation Jammu Kashmir reorganization validity",
    "Polity - Collegium system NJAC struck down judicial appointments debate",
    "Polity - 10th Schedule anti-defection Speaker decision judicial review",
    "Polity - President Art 74 binding Cabinet advice discretion exceptions",
    "Polity - Inter-State Council Finance Commission devolution principles",
    "IR - Panchsheel non-alignment NAM India strategic autonomy evolution",
    "IR - India nuclear doctrine No First Use deterrence credibility",
    "IR - SCO BRICS expansion multipolar world China Russia implications",
    // === UPSC MAINS: ECONOMY DEEP ===
    "Economy - twin balance sheet NPA IBC 2016 resolution NCLT NCLAT",
    "Economy - informal economy unorganized sector labor code reforms India",
    "Economy - Land Acquisition LARR 2013 SEZ industrial corridor issues",
    "Economy - External debt sovereign rating capital account convertibility",
    "Economy - shadow banking NBFC IL&FS crisis regulation gaps India",
    // === UPSC MAINS: SCIENCE & TECH ===
    "Science Tech - quantum computing qubits superposition entanglement India",
    "Science Tech - mRNA vaccines mechanism immunity COVID MRNA platform",
    "Science Tech - semiconductor chip fabrication geopolitics India policy",
    "Science Tech - deep sea mining International Seabed Authority ISA",
    "Science Tech - carbon capture storage hydrogen economy global net zero",
    // === UPSC MAINS: ENVIRONMENT ===
    "Environment - carbon markets voluntary compliance credits pricing ETS",
    "Environment - just transition fossil fuels developing nations equity",
    "Environment - one health approach zoonotic AMR pandemic preparedness",
    "Environment - ecological sensitive zones ESZ Gadgil Kasturirangan report",
    // === GS4: ETHICS HARD ===
    "Ethics - trolley problem consequentialism deontology virtue comparison",
    "Ethics - whistleblowing Edward Snowden Satyendra Dubey public interest",
    "Ethics - Arthashastra statecraft kautilyan realism comparison modern",
    "Ethics - Rawls veil of ignorance justice as fairness distributive",
    // === OPTIONAL: ADVANCED MATHEMATICS ===
    "Mathematics - abstract algebra group ring field Galois theory proofs",
    "Mathematics - real analysis epsilon delta Riemann integral convergence",
    "Mathematics - topology metric spaces compactness connectedness proofs",
    "Mathematics - complex analysis Cauchy theorem residue conformal mapping",
    "Mathematics - number theory RSA Fermat last theorem Riemann hypothesis",
    // === OPTIONAL: ADVANCED SCIENCE ===
    "Physics - quantum mechanics Schrodinger Heisenberg uncertainty principle",
    "Physics - general relativity spacetime curvature black holes Hawking",
    "Physics - nuclear physics fission fusion reactor design criticality",
    "Chemistry - organic named reactions mechanism retrosynthesis NMR",
    "Chemistry - coordination chemistry crystal field theory spectroscopy",
    "Medical Science - immunology antibodies autoimmune diseases monoclonal",
    "Medical Science - pharmacology drug receptor mechanism clinical trials",
    "Medical Science - pathology cancer metastasis molecular markers therapy",
    // === OPTIONAL: ADVANCED ENGINEERING ===
    "Civil Engineering - geotechnical seismic analysis foundation liquefaction",
    "Mechanical Engineering - vibration FEM computational fluid dynamics CFD",
    "Electrical Engineering - power electronics control Bode Nyquist PID",
    "Electrical Engineering - VLSI digital signal processing FFT algorithms",
    "Computer Science - NP-completeness distributed consensus Paxos Raft",
    "Computer Science - advanced DSA segment tree suffix array DP optimization",
    // === OPTIONAL: LITERATURE ADVANCED ===
    "Hindi Literature - Chhayavad Pragativad Prayogvad Nayi Kavita movements",
    "English Literature - postcolonialism subaltern studies Spivak Bhabha",
    "Sanskrit Literature - Meghaduta Abhijnana Shakuntalam Arthashastra detail",
    "Tamil Literature - Thiruvalluvar Thirukkural philosophical interpretations",
    "Sociology - structural functionalism conflict theory Parsons Merton",
    "Political Science - neorealism constructivism Waltz Wendt IR theories",
    "Philosophy - phenomenology Husserl Heidegger existentialism Sartre",
    "Public Administration - NPM new public governance Weber Mintzberg",
    // === ADVANCED CULTURE & MYTHOLOGY ===
    "Indian Mythology - Puranas Bhagavata Vishnu Skanda obscure stories",
    "Indian Mythology - Ramayana versions Valmiki Kamban Tulsidas differences",
    "Indian Mythology - Mahabharata philosophical discourse Gita Bhishma Parva",
    "Indian Heritage - Agama Shastra temple architecture iconography details",
    "Indian Heritage - classical dance forms Bharatanatyam Kathak Odissi grammar",
    // === COMPETITIVE EXAM SPECIAL ===
    "UPSC - ethical dilemma case study administrative discretion decision",
    "UPSC - international organisations WTO IMF G20 reform India position",
    "IIT JEE Advanced - integrated physics chemistry mathematics problems",
    "GATE Advanced - engineering analysis design optimization problems",
    "CAT Level - DILR logical reasoning data sufficiency critical analysis",
    "NIMCET - discrete mathematics formal languages automata computability"
  ]
};

var FFF_CATEGORIES = [
  // Mathematics and calculation
  "Arrange mathematical expressions from smallest to largest calculated value (involve BODMAS, powers, roots, fractions)",
  "Arrange these number sequences - identify the pattern and order correctly (Fibonacci, primes, squares)",
  "Arrange these percentage/ratio calculations from lowest to highest result",
  "Arrange these geometric formulas by complexity or resulting value for given dimensions",
  "Arrange these algebraic expressions by their value when x=3",
  // Logic and aptitude
  "Arrange these logical deduction steps in the correct order to solve the puzzle",
  "Arrange these probability scenarios from least likely to most likely",
  "Arrange these speed-distance-time problems by calculated answer",
  "Arrange these profit-loss scenarios by profit percentage (highest to lowest)",
  "Arrange these data interpretation values from the given table lowest to highest",
  // CS and technical
  "Arrange these programming concepts from beginner to advanced level",
  "Arrange these sorting algorithm time complexities from fastest to slowest",
  "Arrange these data structure operations by time complexity",
  "Arrange these network layers in OSI model from bottom to top",
  // Science and physics
  "Arrange these physics constants by magnitude from smallest to largest",
  "Arrange these chemical elements by atomic number ascending",
  "Arrange these planets by distance from Sun or by size"
];

// Hard FFF prompt builder
function buildFFFPrompt(cat) {
  var seed = Math.floor(Math.random() * 9999999);
  return "Generate a HARD Fastest Finger First KBC question. Category: " + cat + ". Seed:" + seed + "\n" +
    "Rules:\n" +
    "- Arrange exactly 4 items in correct numerical/logical/sequential order\n" +
    "- HARD difficulty: requires actual calculation or deep logical reasoning\n" +
    "- Must NOT be solvable by guessing or general knowledge\n" +
    "- Options must be shuffled (NOT already in correct order)\n" +
    "- Each option must be a specific value, step, or expression\n" +
    "Return ONLY valid JSON with NO markdown:\n" +
    '{"question":"Arrange these from smallest to largest (or in logical order): ...","options":["item1","item2","item3","item4"],"correctOrder":[2,0,3,1],"explanation":"Step-by-step: item2=X, item1=Y, item4=Z, item3=W so order is item2 < item1 < item4 < item3"}';
}

// ============================================================
// QUESTION DEDUPLICATION SYSTEM
// Single source of truth: localStorage key "kbg_q_v3"
// Stores full question text (not truncated) for exact matching
// Also keeps a hash for fast lookup
// ============================================================
var DEDUP_KEY = "kbg_q_v4";

// Always read fresh from localStorage on every check
function _getStore() {
  try {
    var raw = localStorage.getItem(DEDUP_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.texts)) return parsed;
    }
  } catch(e) {}
  return { texts: [], hashes: {} };
}

function _saveStore(store) {
  try {
    localStorage.setItem(DEDUP_KEY, JSON.stringify(store));
  } catch(e) {
    // Storage full - keep only last 100
    try {
      var trimmed = { texts: store.texts.slice(-100), hashes: {} };
      trimmed.texts.forEach(function(t) { trimmed.hashes[_hashQ(t)] = 1; });
      localStorage.setItem(DEDUP_KEY, JSON.stringify(trimmed));
    } catch(e2) {}
  }
}

// Polynomial hash - fast O(n) unique ID per question text
function _hashQ(text) {
  var h = 5381;
  for (var i = 0; i < text.length; i++) {
    h = ((h << 5) + h + text.charCodeAt(i)) & 0x7fffffff;
  }
  return String(h);
}

function markSeen(qText) {
  if (!qText || typeof qText !== "string") return;
  var norm = qText.trim().toLowerCase();
  var hash = _hashQ(norm);
  var store = _getStore();
  if (store.hashes[hash]) return; // already there
  store.hashes[hash] = 1;
  store.texts.push(norm);
  if (store.texts.length > 800) {
    var removed = store.texts.splice(0, 200);
    removed.forEach(function(t) { delete store.hashes[_hashQ(t)]; });
  }
  _saveStore(store);
}

function wasSeen(qText) {
  if (!qText || typeof qText !== "string") return false;
  try {
    var norm = qText.trim().toLowerCase();
    var hash = _hashQ(norm);
    var store = _getStore(); // always fresh from localStorage
    if (store.hashes[hash]) return true;
    // Also check first 55 chars to catch near-duplicates
    var prefix = norm.slice(0, 55);
    return store.texts.some(function(t) { return t.slice(0, 55) === prefix; });
  } catch(e) { return false; }
}

function getRecentSeen(n) {
  try {
    var store = _getStore();
    return store.texts.slice(-n).map(function(t) { return t.slice(0, 80); });
  } catch(e) { return []; }
}

// Session dedup - catches repeats within same browser tab
var _sessionSeen = new Set();
function markSeenSession(q) { if (q) _sessionSeen.add(q.trim().toLowerCase().slice(0, 55)); }
function wasSeenSession(q) { return q ? _sessionSeen.has(q.trim().toLowerCase().slice(0, 55)) : false; }



async function fetchQ(idx) {

  // === QUESTION SLOT → CATEGORY MAPPING ===
  // Each question slot is permanently mapped to a category from the instructions
  // This ensures every game covers ALL required subjects in order of difficulty
  var SLOT_CATEGORIES = [
    // Q1 - Easy mix: Mythology/Culture OR Sports/Entertainment (most engaging first)
    ["Ancient India - Ramayana Mahabharata epics characters events moral lessons",
     "Ancient India - Hindu deities Vishnu Shiva Brahma Durga mythology stories",
     "Bollywood - iconic actors Shah Rukh Salman Aamir roles famous films",
     "Cricket - IPL teams records players auction prices season winners",
     "Sports - Olympics India medals Neeraj Chopra PV Sindhu records",
     "Indian Mythology - Ramayana Sita Ram Hanuman Ravana Lanka stories"],
    // Q2 - History Ancient/Medieval
    ["Ancient India - Indus Valley Harappa Mohenjo-daro artifacts trade",
     "Ancient India - Vedic period Upanishads four Vedas Rig Sama Yajur Atharva",
     "Ancient India - Mauryan empire Ashoka edicts Buddhism spread",
     "Medieval India - Mughal Empire Akbar Humayun Babur Aurangzeb facts",
     "Medieval India - Rajput kingdoms battles forts architecture",
     "Indian Mythology - Mahabharata Pandavas Kauravas Krishna Arjuna facts"],
    // Q3 - Geography + GS General Science basics
    ["Indian Geography - rivers Ganga Yamuna Brahmaputra Krishna Godavari facts",
     "Indian Geography - states capitals languages famous landmarks Taj Mahal",
     "World Geography - continents oceans largest countries capitals flags",
     "General Science - ISRO NASA space missions planets satellites discoveries",
     "General Science - human anatomy organs diseases health basic biology",
     "Indian Festivals - Diwali Holi Eid Christmas Navratri significance dates"],
    // Q4 - CSAT Aptitude / Logical Reasoning
    ["Aptitude Basic - percentages profit loss simple interest class 10",
     "Aptitude Basic - time work speed distance ratio proportion class 10",
     "Logical Reasoning - series patterns odd one out basic analogies",
     "Logical Reasoning - coding decoding blood relations directions",
     "Aptitude Basic - percentages profit loss simple interest class 10",
     "CSAT - syllogisms deductive reasoning venn diagrams conclusions"],
    // Q5 - Modern History + Freedom Struggle + Culture
    ["Modern India - 1857 revolt causes leaders sepoy mutiny regions",
     "Modern India - Indian National Congress Gandhi Nehru Subhas Bose freedom",
     "Modern India - Non-Cooperation movement 1920 events participants results",
     "Modern India - Civil Disobedience Dandi March Salt Satyagraha",
     "Modern India - Partition 1947 independence leaders events dates",
     "Hindi Language - idioms proverbs meanings famous poets Kabir Mirabai"],
    // Q6 - Polity & Constitution (GS2)
    ["Indian Constitution - Preamble Fundamental Rights Articles key provisions",
     "Indian Polity - Parliament Lok Sabha Rajya Sabha President PM functions",
     "Governance - Panchayati Raj local self-government village administration",
     "Polity - Federalism Centre-State relations Article 356 Governor President",
     "Polity - Constitutional Amendments 42nd 44th 73rd 74th 86th key",
     "Social Justice - SC ST OBC reservation Mandal Commission Indra Sawhney"],
    // Q7 - Economy + Business + Entrepreneurs (GS3)
    ["Indian Economy - famous entrepreneurs Tata Ambani Infosys Wipro founders",
     "Indian Economy - RBI SEBI NITI Aayog budget schemes basic",
     "International Organisations - BRICS G20 WTO IMF World Bank SAARC ASEAN",
     "Economy - monetary policy RBI repo reverse repo CRR SLR inflation targeting",
     "Economy - fiscal policy FRBM deficit direct indirect taxes GST structure",
     "Economy - startup ecosystem unicorns venture capital Indian entrepreneurs"],
    // Q8 - Environment + Ecology + Disaster Management (GS3)
    ["Environment - biodiversity ecosystems national parks flora fauna India",
     "Environment - Paris Agreement COP NDC targets India commitments",
     "Environment - biodiversity hotspots India CBD Nagoya Protocol",
     "Environment - disaster management NDMA flood drought earthquake cyclone",
     "Environment - NGT pollution laws Environment Protection Act cases",
     "General Science - plants animals species food chains ecology basic"],
    // Q9 - Science & Technology + Internal Security (GS3)
    ["Science Tech - AI machine learning deep learning applications use cases",
     "Science Tech - ISRO Chandrayaan Mangalyaan Aditya missions details",
     "Science Tech - biotechnology genome CRISPR medical applications ethics",
     "Science Tech - cybersecurity data protection IT Act provisions India",
     "Internal Security - naxalism left wing extremism AFSPA insurgency",
     "Science Tech - electric vehicles battery technology green hydrogen"],
    // Q10 - International Relations + World History (GS2)
    ["International Relations - India bilateral China Pakistan US Russia ties",
     "International Relations - India-China LAC border disputes history",
     "International Relations - Quad AUKUS Pacific strategy India role",
     "World History - Cold War proxy wars Korean Vietnam Cuban missile crisis",
     "World History - decolonization Africa Asia nationalist leaders movements",
     "IR - SCO BRICS expansion multipolar world China Russia implications"],
    // Q11 - Ethics + Integrity + Advanced Polity (GS4)
    ["Ethics - emotional intelligence empathy attitude values concepts",
     "Ethics - public service values integrity probity governance India",
     "Ethics - Gandhian philosophy Sarvodaya Antyodaya trusteeship",
     "Ethics - Kant Bentham Mill Rawls ethical theories comparison",
     "Polity - Kesavananda Bharati 1973 13 judges Basic Structure components",
     "Polity - Emergency provisions Articles 352 356 360 historical uses"],
    // Q12 - Humanities Optional: History/Polity/Sociology deep
    ["History - Kautilya Arthashastra seven elements state philosophy comparison",
     "History - Permanent Settlement 1793 effects Ryotwari Mahalwari comparison",
     "Sociology - caste class gender institutions social mobility Ambedkar",
     "Political Science - democracy theories federalism IR realism liberalism",
     "Philosophy - Indian philosophy Vedanta Nyaya Vaisheshika Samkhya",
     "History - INC moderate extremist split Surat 1907 causes aftermath"],
    // Q13 - Science/Tech Optional: Mathematics/Physics/Chemistry/Engineering
    ["Mathematics - calculus derivatives integrals differential equations",
     "Physics - electromagnetism thermodynamics modern physics concepts",
     "Chemistry - organic reactions inorganic coordination chemistry",
     "Civil Engineering - structural analysis RCC soil mechanics foundation",
     "Mechanical Engineering - thermodynamics fluid mechanics machine design",
     "Electrical Engineering - circuits power systems control electronics"],
    // Q14 - Literature + Medical Science Optional
    ["Hindi Literature - Premchand Nirala Jaishankar Prasad Kabir poetry prose",
     "English Literature - Shakespeare Dickens Hardy Tagore Indian English",
     "Sanskrit Literature - Kalidasa Panini Aryabhatta Chanakya works",
     "Tamil Literature - Sangam poetry Thirukkural Silappadikaram classics",
     "Medical Science - human physiology pathology pharmacology diseases",
     "Computer Science - DSA operating systems DBMS computer networks"],
    // Q15 - Advanced UPSC Mains level deep questions
    ["Polity - Collegium system NJAC struck down judicial appointments debate",
     "Economy - twin balance sheet NPA IBC 2016 resolution NCLT NCLAT",
     "History - Cabinet Mission Plan 1946 provisions Mountbatten acceptance",
     "IR - India nuclear doctrine No First Use deterrence credibility",
     "Environment - one health approach zoonotic AMR pandemic preparedness",
     "Ethics - trolley problem consequentialism deontology virtue comparison"],
    // Q16 - IMPOSSIBLE: Expert/Research/IIT-JEE-Advanced/UPSC-Interview level
    ["Mathematics - abstract algebra group ring field Galois theory proofs",
     "Physics - quantum mechanics Schrodinger Heisenberg uncertainty principle",
     "Chemistry - organic named reactions mechanism retrosynthesis NMR",
     "Computer Science - NP-completeness distributed consensus Paxos Raft",
     "Medical Science - immunology antibodies autoimmune monoclonal antibodies",
     "UPSC - ethical dilemma case study administrative discretion decision"]
  ];

  // Pick topic for this question slot
  var slotTopics = SLOT_CATEGORIES[idx] || SLOT_CATEGORIES[15];
  var topic = slotTopics[Math.floor(Math.random() * slotTopics.length)];
  var topics = TOPICS_BY_LEVEL[idx < 5 ? "easy" : idx < 10 ? "medium" : "hard"];
  var seed = Math.floor(Math.random() * 9999999);


  // BANNED questions - these are too easy - API must NEVER generate these types
  var BANNED = "FORBIDDEN (class 5 school level - NEVER generate these): who wrote Romeo and Juliet, basic unit of life, NaCl formula, sunshine vitamin, Darwin evolution theory, photosynthesis definition, decathlon 10 events, first woman PM India, RAM full form, largest ocean, national animals, boiling point water, speed of light, DNA full form, how many bones human body, H2O, largest planet Jupiter, what does WHO stand for. Generate UPSC/graduate level or above only.";

  // Per-question specific depth instructions with concrete examples
  var diff;
  if (idx === 0) {
    diff = "DIFFICULTY: UPSC Prelims GS Paper 1 standard. Factual questions that require reading and general awareness. Not school level - a working professional should have to think. Example: 'Which Article of the Indian Constitution provides for equal pay for equal work?' or 'What was the Rowlatt Act 1919?'";
  } else if (idx === 1) {
    diff = "DIFFICULTY: UPSC Prelims standard / SSC CGL / Bank PO. Requires specific factual knowledge of history geography polity economy. Example: 'Which movement was launched after the Jallianwala Bagh massacre?' or 'What is the Van't Hoff factor in chemistry?'";
  } else if (idx === 2) {
    diff = "DIFFICULTY: UPSC CSAT Paper 2 level - logical reasoning analytical ability. Or GS Paper with application-level question. Example: 'In a group of 6, A sits opposite B, C is between D and E...' type reasoning. Or 'What is Laffer Curve?' requiring conceptual understanding.";
  } else if (idx === 3) {
    diff = "DIFFICULTY: UPSC Prelims tricky questions - the kind that confuse even prepared candidates. Involves exceptions, specific years, exact provisions, close-call options. Example: 'Which Schedule of the Indian Constitution deals with anti-defection law?' All 4 options must be real Schedules/Articles.";
  } else if (idx === 4) {
    diff = "DIFFICULTY: UPSC Mains GS Paper 1 level. Deep factual knowledge with nuanced options. Example: 'Distinguish between the Permanent Settlement, Ryotwari and Mahalwari systems - under which the Government directly dealt with peasants?' Options must all be specific, real, and confusing.";
  } else if (idx === 5) {
    diff = "DIFFICULTY: UPSC Mains GS Paper 2 - Polity and IR deep level. Requires knowledge of specific judgements, treaty provisions, constitutional articles, landmark cases. Example: 'In Minerva Mills case, which Articles of the Constitution were struck down?' All options must be real Articles.";
  } else if (idx === 6) {
    diff = "DIFFICULTY: UPSC Mains GS Paper 3 - Economy, Environment, Science & Tech deep. Specific provisions, exact mechanisms, policy details. Example: 'What is the Insolvency Resolution Process (IRP) under IBC 2016 and what is the time limit?' Options must all be real provisions.";
  } else if (idx === 7) {
    diff = "DIFFICULTY: UPSC Mains GS Paper 4 - Ethics case study level. Or Optional subject entrance level. Requires deep ethical reasoning or technical subject knowledge. Example: 'A civil servant discovers his senior is involved in corruption that affects thousands. He has documented evidence. Under which law can he file a complaint and what protection is available?'";
  } else if (idx === 8) {
    diff = "DIFFICULTY: UPSC Optional subject Paper 1 level. Specialist knowledge required. The question should be answerable only by someone who has specifically studied this subject at graduation or post-graduation level. All 4 options must be real technical terms or values from the same narrow domain.";
  } else if (idx === 9) {
    diff = "DIFFICULTY: UPSC Optional Paper 2 / IIT JEE Advanced level. Deeply technical question that requires synthesis of multiple concepts. Even subject graduates may second-guess. All 4 options must be indistinguishable to anyone without precise memorized knowledge of this exact detail.";
  } else if (idx === 10) {
    diff = "DIFFICULTY: IIT JEE Advanced / GATE / CAT level. The most difficult standard question in this topic. Requires precise technical knowledge, not guessable. Wrong options must be real concepts that are commonly confused with the correct answer. A random guess has effectively zero chance.";
  } else if (idx === 11) {
    diff = "DIFFICULTY: IIT JEE Advanced integration question OR UPSC Interview level. Requires connecting multiple concepts across the topic. So specific that even a professor in the field may pause before answering. All options must look equally correct to someone without exact knowledge.";
  } else if (idx === 12) {
    diff = "DIFFICULTY: PhD entrance / Research level question. The most obscure specific detail in this entire subject area. Something found only in advanced textbooks or research papers. 4 options that are all technically real but only one is precisely correct in this exact context.";
  } else if (idx === 13) {
    diff = "DIFFICULTY: Near impossible - only a genuine domain expert with specific research background would know. Ask about exact values, specific sub-clauses, precise mechanisms, rare historical details. All 4 options must be from the exact same technical domain and all plausible.";
  } else if (idx === 14) {
    diff = "DIFFICULTY: World expert level. The rarest, most specific fact in this topic. Something even textbooks rarely cover precisely. Options differ only in minute specific details - a single word, a number, a year, a mechanism step. 99% of experts would have to guess.";
  } else {
    diff = "DIFFICULTY: IMPOSSIBLE. The single hardest question that can be asked on this topic. Something from a specific research paper, obscure legal provision, exact experimental value, or highly technical mechanism. All 4 options are real terms from the same narrow sub-field and completely indistinguishable without precise specialist memory.";
  }

  // Smart special instructions based on topic category - applied per question
  var special = "";
  var topicLow = topic.toLowerCase();
  if (topicLow.indexOf("ramayana") >= 0 || topicLow.indexOf("mahabharata") >= 0 || topicLow.indexOf("mythology") >= 0 || topicLow.indexOf("deity") >= 0 || topicLow.indexOf("deities") >= 0) {
    special = " Ask specific character relationships, events, alternative versions, or philosophical meanings from the epics. NOT obvious main storyline facts.";
  } else if (topicLow.indexOf("bollywood") >= 0 || topicLow.indexOf("film") >= 0 || topicLow.indexOf("cinema") >= 0 || topicLow.indexOf("hollywood") >= 0) {
    special = " Ask about specific film facts - release year, co-stars, awards, director, dialogue source, song composer - that a real film fan would know but casual viewer would not.";
  } else if (topicLow.indexOf("cricket") >= 0 || topicLow.indexOf("ipl") >= 0 || topicLow.indexOf("sports") >= 0 || topicLow.indexOf("olympics") >= 0 || topicLow.indexOf("football") >= 0 || topicLow.indexOf("kabaddi") >= 0 || topicLow.indexOf("badminton") >= 0) {
    special = " Ask about exact records, statistics, years, player achievements - numbers must be precise. All 4 options must be realistic numerical values or player names.";
  } else if (topicLow.indexOf("fill in") >= 0 || topicLow.indexOf("lyrics") >= 0 || topicLow.indexOf("dialogue") >= 0 || topicLow.indexOf("idiom") >= 0 || topicLow.indexOf("proverb") >= 0) {
    special = " Format: Show text with ____ for missing word. Include the source name. The missing word must be non-obvious. Options must all be plausible-sounding words.";
  } else if (topicLow.indexOf("aptitude") >= 0 || topicLow.indexOf("csat") >= 0 || topicLow.indexOf("logical") >= 0 || topicLow.indexOf("reasoning") >= 0 || topicLow.indexOf("numeracy") >= 0) {
    special = " Give a specific calculation or logic puzzle with actual numbers/statements. Require actual working-out. Options must be 4 close numerical values or specific logical conclusions.";
  } else if (topicLow.indexOf("data interpretation") >= 0) {
    special = " Embed a small data table or % values in the question text. Ask a specific calculated question about it. Options must be 4 close numerical answers.";
  } else if (topicLow.indexOf("ethics") >= 0 || topicLow.indexOf("integrity") >= 0) {
    special = " Ask about a specific ethical philosopher, concept, or administrative dilemma scenario. Options must represent genuinely different ethical positions.";
  } else if (topicLow.indexOf("polity") >= 0 || topicLow.indexOf("constitution") >= 0 || topicLow.indexOf("governance") >= 0 || topicLow.indexOf("amendment") >= 0) {
    special = " Ask about specific Article numbers, Schedule names, Amendment numbers, or landmark case names. All 4 options must be real Articles/cases/Schedules.";
  } else if (topicLow.indexOf("history") >= 0 || topicLow.indexOf("medieval") >= 0 || topicLow.indexOf("ancient") >= 0 || topicLow.indexOf("mughal") >= 0 || topicLow.indexOf("freedom") >= 0) {
    special = " Ask about specific years, exact names, obscure but important historical details. Options must be real historical figures, dates, or events from the same period.";
  } else if (topicLow.indexOf("geography") >= 0 || topicLow.indexOf("monument") >= 0 || topicLow.indexOf("river") >= 0) {
    special = " Ask about specific locations, historical facts, or geographical features that require precise knowledge. Options must be real places or values that are commonly confused.";
  } else if (topicLow.indexOf("economy") >= 0 || topicLow.indexOf("entrepreneur") >= 0 || topicLow.indexOf("brand") >= 0 || topicLow.indexOf("business") >= 0) {
    special = " Ask about specific data, policy names, founding year, exact provisions. Options must be real companies, policies, or economic figures.";
  } else if (topicLow.indexOf("literature") >= 0 || topicLow.indexOf("hindi") >= 0 || topicLow.indexOf("sanskrit") >= 0 || topicLow.indexOf("tamil") >= 0) {
    special = " Ask about specific works, authors, movements, or characters. All 4 options must be real authors or works from the same literary tradition.";
  } else if (topicLow.indexOf("mathematics") >= 0 || topicLow.indexOf("calculus") >= 0 || topicLow.indexOf("algebra") >= 0) {
    special = " Ask a calculation or theorem question with a specific numerical answer. Options must be 4 close numbers that differ slightly.";
  } else if (topicLow.indexOf("physics") >= 0 || topicLow.indexOf("quantum") >= 0 || topicLow.indexOf("chemistry") >= 0) {
    special = " Ask about a specific equation, constant value, named reaction, or experimental result. Options must be real scientific values or names.";
  } else if (topicLow.indexOf("engineering") >= 0 || topicLow.indexOf("civil") >= 0 || topicLow.indexOf("mechanical") >= 0 || topicLow.indexOf("electrical") >= 0 || topicLow.indexOf("dsa") >= 0 || topicLow.indexOf("computer science") >= 0) {
    special = " Ask about specific formulas, algorithms, time complexities, or technical mechanisms. All options must be real technical terms or values.";
  } else if (topicLow.indexOf("environment") >= 0 || topicLow.indexOf("ecology") >= 0 || topicLow.indexOf("climate") >= 0 || topicLow.indexOf("biodiversity") >= 0) {
    special = " Ask about specific treaty names, Article provisions, species names, or policy details. Options must be real laws, species, or agreements.";
  } else if (topicLow.indexOf("upsc") >= 0 || topicLow.indexOf("iit") >= 0 || topicLow.indexOf("gate") >= 0 || topicLow.indexOf("cat") >= 0 || topicLow.indexOf("nimcet") >= 0) {
    special = " Generate a question in the exact style of this exam's previous papers. Match the difficulty and phrasing format precisely.";
  }

  var confuse = " MANDATORY: All 4 options must be specific, real, plausible. NEVER obviously wrong distractors. Wrong options must be from the same domain and genuinely confusing. User must need precise knowledge to distinguish.";

  // Randomly pick a question STYLE to force variety - different angle every call
  var styles = [
    "Ask about a specific NUMBER or YEAR (exact figure that requires knowledge)",
    "Ask about WHO did/invented/discovered something specific and obscure",
    "Ask about WHAT a specific technical term, theorem or concept means",
    "Ask about WHY a specific event happened or what caused a particular outcome",
    "Ask about HOW a specific mechanism, process or algorithm works",
    "Ask WHICH specific case/law/act/treaty established or defined something",
    "Give a scenario or description and ask the user to IDENTIFY what it is",
    "Ask about the DIFFERENCE between two very similar concepts in the topic",
    "Ask about WHEN a specific important event in this topic occurred",
    "Ask about a specific FORMULA, EQUATION, or CALCULATION in this topic"
  ];
  var style = styles[Math.floor(Math.random() * styles.length)];




  try {
    var data = null;
    var attempts = 0;
    var maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        // Each retry gets a completely fresh seed and possibly a new topic
        var trySeed = Math.floor(Math.random() * 99999999);
        var tryTopic = attempts < 2
          ? topic
          : slotTopics[Math.floor(Math.random() * slotTopics.length)];

        // Rebuild recent-seen list fresh each attempt
        var recentNow = getRecentSeen(10);
        var avoidNow = recentNow.length > 0
          ? "\nAVOID REPEATING these exact questions already asked:\n" +
            recentNow.map(function(q, i) { return (i+1) + ". " + q; }).join("\n")
          : "";

        // Build a completely fresh prompt each attempt with random style
        var tryStyle = styles[Math.floor(Math.random() * styles.length)];
        var tryPrompt = trySeed + " " + BANNED +
          "\n\nGenerate ONE KBC quiz question." +
          "\nTopic: " + tryTopic +
          "\nQuestion Style: " + tryStyle +
          "\n" + diff + special + confuse + avoidNow +
          "\n\nPut correct answer at index 0. Return ONLY valid JSON no markdown:\n" +
          "{\"question\":\"?\",\"options\":[\"CORRECT\",\"wrong1\",\"wrong2\",\"wrong3\"]," +
          "\"correct\":0,\"topic\":\"" + tryTopic + "\"," +
          "\"explanation\":\"Why correct. Why each wrong option is wrong.\"}";

        data = await callAPI(tryPrompt, 700);

        // Validate structure
        if (!data || !data.question || typeof data.question !== "string" || data.question.length < 10) {
          attempts++; data = null; continue;
        }
        if (!Array.isArray(data.options) || data.options.length !== 4) {
          attempts++; data = null; continue;
        }
        var hasEmptyOpt = data.options.some(function(o) {
          return !o || typeof o !== "string" || o.trim().length < 1;
        });
        if (hasEmptyOpt) { attempts++; data = null; continue; }

        // Dedup check - fresh from localStorage every time
        if (wasSeenSession(data.question) || wasSeen(data.question)) {
          attempts++; data = null; continue;
        }

        // Good unique question
        break;

      } catch(innerErr) {
        attempts++;
        await new Promise(function(r) { setTimeout(r, 300); });
      }
    }

    if (!data || !data.question) {
      return getOfflineQ(idx);
    }

    // Record in both stores immediately
    markSeen(data.question);
    markSeenSession(data.question);

    // Normalize correct index
    var correctIdx = (typeof data.correct === "number" && data.correct >= 0 && data.correct < 4) ? data.correct : 0;
    var correctAnswer = data.options[correctIdx];

    // GUARANTEED CLIENT-SIDE SHUFFLE
    var targetPos = Math.floor(Math.random() * 4);
    var wrongs = [];
    for (var wi = 0; wi < 4; wi++) {
      if (wi !== correctIdx) wrongs.push(data.options[wi]);
    }
    for (var fi = wrongs.length - 1; fi > 0; fi--) {
      var fj = Math.floor(Math.random() * (fi + 1));
      var ft = wrongs[fi]; wrongs[fi] = wrongs[fj]; wrongs[fj] = ft;
    }
    var finalOpts = [];
    var wi2 = 0;
    for (var oi = 0; oi < 4; oi++) {
      if (oi === targetPos) { finalOpts.push(correctAnswer); }
      else { finalOpts.push(wrongs[wi2++]); }
    }
    data.options = finalOpts;
    data.correct = targetPos;

    return data;
  } catch(e) {
    return getOfflineQ(idx);
  }
}

async function translateQ(q) {
  if (!q || !q.question || !Array.isArray(q.options)) return null;
  var prompt = "Translate this KBC quiz question to Hindi (Devanagari). Keep numbers, proper nouns, technical terms, abbreviations in English. Return ONLY valid JSON, no markdown.\nQ: " + q.question + "\nA: " + q.options[0] + "\nB: " + q.options[1] + "\nC: " + q.options[2] + "\nD: " + q.options[3] + "\nJSON: {\"question\":\"Hindi question?\",\"options\":[\"Hindi A\",\"Hindi B\",\"Hindi C\",\"Hindi D\"],\"explanation\":\"Hindi explanation\"}";
  try {
    var result = await callAPI(prompt, 600);
    if (!result || !result.question || !Array.isArray(result.options) || result.options.length !== 4) throw new Error("bad");
    // Validate each option is non-empty
    var allValid = result.options.every(function(o) { return o && typeof o === "string" && o.trim().length > 0; });
    if (!allValid) throw new Error("empty option");
    return result;
  } catch(e) {
    // Try once more with different phrasing
    try {
      var p2 = "Hindi translate. Question: " + q.question + ". Options: " + q.options.join(" | ") + ". Return JSON: {\"question\":\"...\",\"options\":[\"...\",\"...\",\"...\",\"...\"],\"explanation\":\"...\"}";
      var r2 = await callAPI(p2, 600);
      if (r2 && r2.question && Array.isArray(r2.options) && r2.options.length === 4) return r2;
    } catch(e2) {}
    return getOfflineHindi(q);
  }
}

async function expertOpinion(question, opts, correct) {
  var label = ["A","B","C","D"][correct];
  var prompt = "You are a KBC expert lifeline. The question is: \"" + question + "\"\nOptions: A) " + opts[0] + " B) " + opts[1] + " C) " + opts[2] + " D) " + opts[3] + "\nThe correct answer is " + label + ". Give a 2-3 sentence expert opinion that strongly hints toward option " + label + " WITHOUT directly saying it is correct. Sound like a subject expert. Be natural and conversational.";
  try {
    var r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 200, messages: [{ role: "user", content: prompt }] })
    });
    var d = await r.json();
    return d.content.map(function(b) { return b.text || ""; }).join("").trim();
  } catch(e) {
    return getOfflineExpert(question, opts, correct);
  }
}

async function fetchFFFQ() {
  var cat = FFF_CATEGORIES[Math.floor(Math.random() * FFF_CATEGORIES.length)];
  var prompt = buildFFFPrompt(cat);
  try {
    var result = await callAPI(prompt, 600);
    if (!result.question || !result.options || !result.correctOrder) throw new Error("Invalid");
    if (result.options.length !== 4 || result.correctOrder.length !== 4) throw new Error("Wrong length");
    // Validate correctOrder has all 4 indices 0-3
    var sorted = result.correctOrder.slice().sort(function(a,b){return a-b;});
    if (sorted.join(',') !== '0,1,2,3') throw new Error("Bad order");
    return result;
  } catch(e) {
    return getOfflineFFF();
  }
}


function do5050(opts, correct) {
  var wrong = opts.map(function(_, i) { return i; }).filter(function(i) { return i !== correct; }).sort(function() { return Math.random() - 0.5; }).slice(0, 2);
  return opts.map(function(o, i) { return wrong.indexOf(i) >= 0 ? null : o; });
}

function makePoll(correct) {
  var b = [6, 6, 6, 6];
  b[correct] = 58;
  [0, 1, 2, 3].filter(function(i) { return i !== correct; }).forEach(function(i, x) { b[i] += [16, 8, 4][x] || 0; });
  return b.map(function(v) { return Math.min(100, Math.max(1, v + Math.floor(Math.random() * 8 - 4))); });
}

// CSS
var CSS = [
"@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&family=Exo+2:wght@400;500;600;700;800&display=swap');",
"*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}",
":root{--bg:#020008;--glow:#9500ff;--glow2:#c060ff;--gold:#FFD700;--gold2:#FFAA00;--green:#00ffbb;--red:#ff1144;--cyan:#00eeff;--text:#fff;--dim:#aa99cc;}",
"@keyframes shimmer{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}",
"@keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}",
"@keyframes borderGlow{0%,100%{border-color:rgba(139,0,255,0.5)}50%{border-color:rgba(180,77,255,0.95)}}",
"html,body{background:var(--bg);font-family:'Barlow',sans-serif;color:var(--text);min-height:100vh;min-height:100dvh;overflow-x:hidden;-webkit-text-size-adjust:100%;touch-action:manipulation;}",
".app{position:relative;min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;background:radial-gradient(ellipse at 30% 20%,#1f0042 0%,#08000e 45%,#020008 100%)}",
".app::before{content:'';position:fixed;inset:0;background:radial-gradient(circle at 20% 50%,rgba(123,47,255,0.08) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(0,150,255,0.06) 0%,transparent 40%);pointer-events:none;z-index:0}",
".app::after{content:'';position:fixed;inset:0;background-image:radial-gradient(1px 1px at 10% 15%,rgba(255,255,255,0.9) 0%,transparent 100%),radial-gradient(1px 1px at 25% 60%,rgba(255,255,255,0.7) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 40% 8%,rgba(255,255,255,1) 0%,transparent 100%),radial-gradient(1px 1px at 55% 75%,rgba(255,255,255,0.8) 0%,transparent 100%),radial-gradient(1px 1px at 70% 30%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(1px 1px at 85% 55%,rgba(255,255,255,0.75) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 15% 85%,rgba(255,255,255,0.85) 0%,transparent 100%),radial-gradient(1px 1px at 90% 10%,rgba(255,255,255,0.65) 0%,transparent 100%);animation:twinkle 4s ease-in-out infinite alternate;pointer-events:none;z-index:0}",
"@keyframes twinkle{0%{opacity:0.3}100%{opacity:1}}",
".content{position:relative;z-index:1;flex:1;display:flex;flex-direction:column}",
".hdr{text-align:center;padding:clamp(8px,2vw,14px) 16px clamp(4px,1vw,8px);background:linear-gradient(180deg,rgba(0,0,0,0.7) 0%,transparent 100%);border-bottom:1px solid rgba(123,47,255,0.2);position:relative;flex-shrink:0}",
".logo{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.3rem,5.5vw,3rem);font-weight:400;letter-spacing:clamp(2px,0.8vw,6px);text-transform:uppercase;background:linear-gradient(90deg,#fff8d0,#FFD700,#FF8C00,#FFD700,#fff8d0);background-size:200% 200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 25px rgba(255,215,0,0.9));animation:logoPulse 3s ease-in-out infinite alternate,shimmer 5s ease-in-out infinite;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
"@keyframes logoPulse{0%{filter:drop-shadow(0 0 10px rgba(255,215,0,0.4))}100%{filter:drop-shadow(0 0 30px rgba(255,215,0,1))}}",
".logo-sub{font-family:'Exo 2',sans-serif;font-size:clamp(0.48rem,1.4vw,0.65rem);color:rgba(200,180,255,0.6);letter-spacing:clamp(2px,0.5vw,5px);text-transform:uppercase;margin-top:-2px}",
".hdr-btns{position:absolute;right:8px;top:50%;transform:translateY(-50%);display:flex;gap:4px;align-items:center}",
".hbtn{background:rgba(50,10,100,0.7);border:1px solid rgba(123,47,255,0.4);border-radius:6px;padding:clamp(3px,0.8vw,6px) clamp(6px,1.5vw,10px);cursor:pointer;color:rgba(200,180,255,0.9);font-size:clamp(0.5rem,1.4vw,0.64rem);font-family:'Exo 2',sans-serif;font-weight:600;transition:all 0.2s;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;-webkit-tap-highlight-color:transparent}",
".hbtn:hover,.hbtn:active{border-color:var(--glow2);background:rgba(80,20,160,0.8)}",
".hbtn.exit{border-color:rgba(255,34,68,0.4);color:rgba(255,150,150,0.9)}",
".hbtn.exit:hover,.hbtn.exit:active{background:rgba(100,10,30,0.8);border-color:var(--red)}",
".hbtn.tr{border-color:rgba(0,207,255,0.4);color:rgba(150,230,255,0.9)}",
".hbtn.tr.rdy{border-color:rgba(0,207,255,0.7);box-shadow:0 0 8px rgba(0,207,255,0.3)}",
".hbtn.tr.loading{border-color:rgba(255,215,0,0.6);color:rgba(255,215,0,0.8);animation:logoPulse 0.8s ease-in-out infinite alternate}",
".hbtn.tr.on{background:rgba(0,50,100,0.8);border-color:var(--cyan);color:var(--cyan)}",
".rules-screen{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:clamp(12px,3vw,24px) clamp(10px,3vw,20px);overflow-y:auto}",
".rules-card{background:linear-gradient(145deg,rgba(15,0,35,0.97),rgba(30,0,70,0.92));border:2px solid rgba(123,47,255,0.5);border-radius:16px;padding:clamp(16px,4vw,28px) clamp(14px,4vw,24px);max-width:600px;width:100%;box-shadow:0 0 60px rgba(139,0,255,0.3),0 0 120px rgba(139,0,255,0.1);animation:fadeUp 0.5s ease,borderGlow 4s ease-in-out infinite}",
"@keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}",
".rules-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.5rem,6vw,2.2rem);letter-spacing:3px;text-transform:uppercase;color:var(--gold);text-align:center;margin-bottom:4px;filter:drop-shadow(0 0 10px rgba(255,215,0,0.5));font-weight:400}",
".rules-sub{font-family:'Exo 2',sans-serif;font-size:clamp(0.58rem,1.8vw,0.72rem);color:var(--dim);letter-spacing:2px;text-transform:uppercase;text-align:center;margin-bottom:clamp(12px,3vw,20px)}",
".rule-item{display:flex;gap:10px;align-items:flex-start;margin-bottom:9px;padding:clamp(7px,2vw,10px) clamp(10px,2.5vw,13px);background:rgba(60,10,120,0.22);border:1px solid rgba(123,47,255,0.18);border-radius:9px}",
".rule-num{font-family:'Bebas Neue',sans-serif;font-size:clamp(0.9rem,2.5vw,1.1rem);color:var(--gold);width:22px;flex-shrink:0;text-align:center;line-height:1.2;font-weight:700}",
".rule-txt{font-family:'Barlow',sans-serif;font-size:clamp(0.72rem,2vw,0.84rem);color:rgba(220,210,255,0.9);line-height:1.58;font-weight:400}",
".btn-play{background:linear-gradient(135deg,rgba(123,47,255,0.9),rgba(160,70,255,0.95));border:2px solid rgba(200,150,255,0.5);border-radius:50px;padding:clamp(10px,2.5vw,14px) clamp(28px,8vw,52px);font-family:'Bebas Neue',sans-serif;font-size:clamp(0.9rem,2.8vw,1.12rem);font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;cursor:pointer;display:block;margin:clamp(14px,3vw,22px) auto 0;box-shadow:0 0 28px rgba(123,47,255,0.5);transition:all 0.3s;-webkit-tap-highlight-color:transparent;width:fit-content}",
".btn-play:hover,.btn-play:active{transform:scale(1.04);box-shadow:0 0 45px rgba(123,47,255,0.8)}",
".load-screen{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:20px}",
".loader{width:clamp(40px,10vw,56px);height:clamp(40px,10vw,56px);border:4px solid rgba(123,47,255,0.2);border-top:4px solid var(--glow2);border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0}",
"@keyframes spin{to{transform:rotate(360deg)}}",
".load-txt{font-family:'Bebas Neue',sans-serif;color:var(--glow2);font-size:clamp(0.8rem,3vw,1rem);letter-spacing:3px;text-transform:uppercase;text-align:center}",
".load-sub{color:var(--dim);font-size:clamp(0.62rem,1.8vw,0.74rem);text-align:center;padding:0 16px}",
".game-layout{flex:1;display:flex;max-width:1200px;width:100%;margin:0 auto;padding:clamp(5px,1.5vw,10px);overflow:hidden;min-height:0}",
".game-center{flex:1;display:flex;flex-direction:column;gap:clamp(5px,1.5vw,8px);min-width:0;padding-right:clamp(0px,1vw,10px);overflow-y:auto;scrollbar-width:none}",
".game-center::-webkit-scrollbar{display:none}",
".prize-panel{width:clamp(170px,13vw,220px);flex-shrink:0;display:flex;flex-direction:column;align-self:stretch}",
"@media(max-width:750px){.prize-panel{display:none}}",
".prize-box{background:linear-gradient(180deg,#1a0040 0%,#0d0028 100%);border:none;border-left:3px solid rgba(255,215,0,0.3);overflow:hidden;flex:1;display:flex;flex-direction:column}",
".prize-header{font-family:'Bebas Neue',sans-serif;font-size:clamp(1rem,1.3vw,1.2rem);color:var(--gold);letter-spacing:4px;text-align:center;padding:10px 6px 8px;border-bottom:2px solid rgba(255,215,0,0.4);text-transform:uppercase;background:linear-gradient(180deg,rgba(255,215,0,0.1),transparent);text-shadow:0 0 12px rgba(255,215,0,0.7);flex-shrink:0}",
".prize-list{display:flex;flex-direction:column-reverse;flex:1;overflow:hidden;padding:0}",
".prize-list::-webkit-scrollbar{display:none}",
".prow{display:flex;align-items:center;padding:0 10px;gap:0;transition:all 0.25s;flex:1;min-height:0;border-left:4px solid transparent}",
".prow.active{background:linear-gradient(90deg,rgba(255,200,0,0.35),rgba(255,165,0,0.15),rgba(255,200,0,0.08));border-left:6px solid var(--gold)}",
".prow.passed{background:rgba(0,180,80,0.04)}",
".prow.upcoming{}",
".prow.safe-r{border-bottom:1.5px solid rgba(255,215,0,0.35)}",
".prow-q{font-family:'Bebas Neue',sans-serif;font-size:clamp(0.85rem,1.15vw,1.1rem);color:rgba(200,180,255,0.7);width:28px;flex-shrink:0;font-weight:400;text-align:left;line-height:1}",
".prow.active .prow-q{color:#fff;font-size:clamp(1rem,1.4vw,1.25rem)}",
".prow.passed .prow-q{color:rgba(0,255,136,0.7)}",
".prow-p{font-family:'Bebas Neue',sans-serif;font-size:clamp(0.82rem,1.1vw,1.05rem);font-weight:400;flex:1;text-align:right;letter-spacing:0.5px;color:rgba(220,200,255,0.75);line-height:1}",
".prow.active .prow-p{color:var(--gold);font-size:clamp(0.95rem,1.3vw,1.2rem);font-weight:400;text-shadow:0 0 10px rgba(255,215,0,0.8);animation:activePrize 1.2s ease-in-out infinite alternate}",
"@keyframes activePrize{0%{text-shadow:0 0 6px rgba(255,215,0,0.5)}100%{text-shadow:0 0 18px rgba(255,215,0,1)}}",
".prow.passed .prow-p{color:rgba(0,255,136,0.65)}",
".prow.upcoming .prow-p{color:rgba(200,180,255,0.55)}",
".prize-strip{display:none;overflow-x:auto;padding:5px 3px;background:linear-gradient(90deg,rgba(10,0,25,0.95),rgba(20,0,50,0.85));border:1px solid rgba(123,47,255,0.2);border-radius:8px;scrollbar-width:none;flex-shrink:0}",
".prize-strip::-webkit-scrollbar{display:none}",
"@media(max-width:750px){.prize-strip{display:flex}}",
".ps-n{display:flex;flex-direction:column;align-items:center;gap:1px;min-width:clamp(33px,8.5vw,42px);flex-shrink:0;padding:2px}",
".ps-dot{width:clamp(19px,5.2vw,26px);height:clamp(19px,5.2vw,26px);border-radius:50%;background:rgba(40,10,80,0.8);border:1.5px solid rgba(80,30,160,0.7);display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:clamp(0.48rem,1.4vw,0.62rem);font-weight:700;color:var(--dim);transition:all 0.3s}",
".ps-n.active .ps-dot{background:linear-gradient(135deg,rgba(123,47,255,0.9),rgba(160,80,255,0.9));border-color:var(--glow2);color:#fff;width:clamp(23px,6.2vw,30px);height:clamp(23px,6.2vw,30px);box-shadow:0 0 10px rgba(123,47,255,0.6)}",
".ps-n.passed .ps-dot{background:rgba(0,80,40,0.5);border-color:rgba(0,200,100,0.4);color:rgba(0,255,136,0.8)}",
".ps-amt{font-family:'Exo 2',sans-serif;font-size:clamp(0.36rem,1.1vw,0.48rem);color:var(--dim);text-align:center;white-space:nowrap}",
".ps-n.active .ps-amt{color:var(--gold)}",
".lifeline-bar{display:flex;align-items:center;justify-content:center;gap:clamp(3px,1.2vw,7px);background:linear-gradient(90deg,transparent,rgba(30,0,70,0.6),transparent);border-radius:50px;padding:clamp(5px,1.3vw,8px) clamp(7px,2vw,14px);border:1px solid rgba(123,47,255,0.2);flex-wrap:nowrap;flex-shrink:0;overflow-x:auto;scrollbar-width:none}",
".lifeline-bar::-webkit-scrollbar{display:none}",
".ll-item{display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;transition:all 0.2s;padding:clamp(3px,0.9vw,5px) clamp(5px,1.6vw,10px);border-radius:8px;border:1px solid rgba(123,47,255,0.25);background:rgba(50,10,100,0.5);flex-shrink:0;-webkit-tap-highlight-color:transparent}",
".ll-item:hover:not(.used),.ll-item:active:not(.used){border-color:var(--glow2);background:rgba(80,20,160,0.7)}",
".ll-item.used{opacity:0.18;cursor:not-allowed;filter:grayscale(1)}",
".ll-icon{font-size:clamp(0.85rem,2.4vw,1.12rem)}",
".ll-label{font-family:'Exo 2',sans-serif;font-size:clamp(0.42rem,1.1vw,0.57rem);color:rgba(200,180,255,0.8);letter-spacing:0.5px;text-transform:uppercase;font-weight:600}",
".ll-sep{width:1px;height:clamp(26px,6.5vw,36px);background:rgba(123,47,255,0.25);flex-shrink:0}",
".ll-timer{display:flex;flex-direction:column;align-items:center;gap:1px;padding:clamp(3px,0.8vw,5px) clamp(7px,1.8vw,12px);border-radius:8px;border:1px solid rgba(0,207,255,0.3);background:rgba(0,30,60,0.5);flex-shrink:0}",
".ll-timer.warn{border-color:rgba(255,109,0,0.5);background:rgba(60,20,0,0.5)}",
".ll-timer.urgent{border-color:rgba(255,34,68,0.6);background:rgba(60,0,10,0.6);animation:urgentPulse 0.35s ease-in-out infinite alternate}",
"@keyframes urgentPulse{0%{box-shadow:none}100%{box-shadow:0 0 18px rgba(255,34,68,0.8)}}",
".ll-time-val{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.2rem,3.8vw,1.7rem);font-weight:400;color:var(--cyan);line-height:1}",
".ll-timer.warn .ll-time-val{color:orange}",
".ll-timer.urgent .ll-time-val{color:var(--red)}",
".ll-time-lbl{font-family:'Exo 2',sans-serif;font-size:clamp(0.38rem,1vw,0.52rem);color:var(--dim);letter-spacing:1px;text-transform:uppercase}",
".ll-winnings{display:flex;flex-direction:column;align-items:center;gap:1px;padding:clamp(3px,0.8vw,5px) clamp(6px,1.7vw,10px);border-radius:8px;border:1px solid rgba(255,215,0,0.28);background:rgba(40,25,0,0.5);flex-shrink:0}",
".ll-win-val{font-family:'Bebas Neue',sans-serif;font-size:clamp(0.78rem,2.2vw,1.05rem);font-weight:400;color:var(--gold);line-height:1}",
".ll-win-lbl{font-family:'Exo 2',sans-serif;font-size:clamp(0.36rem,0.9vw,0.5rem);color:rgba(200,180,100,0.7);letter-spacing:1px;text-transform:uppercase}",
".ll-quit{cursor:pointer;padding:clamp(3px,0.8vw,6px) clamp(7px,1.8vw,12px);border-radius:8px;border:1px solid rgba(255,34,68,0.3);background:rgba(60,0,10,0.5);font-family:'Exo 2',sans-serif;font-size:clamp(0.46rem,1.2vw,0.62rem);font-weight:700;color:rgba(255,150,150,0.85);letter-spacing:1px;text-transform:uppercase;transition:all 0.2s;flex-shrink:0;-webkit-tap-highlight-color:transparent}",
".ll-quit:hover,.ll-quit:active{border-color:var(--red);background:rgba(100,0,20,0.7)}",
".dc-banner{background:linear-gradient(90deg,rgba(255,165,0,0.1),rgba(255,215,0,0.07));border:1px solid rgba(255,215,0,0.35);border-radius:8px;padding:clamp(4px,1.2vw,7px) 12px;text-align:center;font-family:'Exo 2',sans-serif;font-size:clamp(0.6rem,1.7vw,0.75rem);font-weight:700;color:var(--gold);letter-spacing:1px;animation:fadeIn 0.3s ease;display:flex;align-items:center;justify-content:center;gap:6px;flex-shrink:0}",
".dc-dot{width:7px;height:7px;border-radius:50%;background:var(--gold);box-shadow:0 0 6px var(--gold);animation:pulse 0.8s ease-in-out infinite alternate;flex-shrink:0}",
"@keyframes pulse{0%{opacity:0.5}100%{opacity:1}}",
"@keyframes fadeIn{from{opacity:0}to{opacity:1}}",
".hindi-ind{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:rgba(0,30,60,0.5);border:1px solid rgba(0,207,255,0.25);border-radius:6px;font-family:'Exo 2',sans-serif;font-size:clamp(0.54rem,1.5vw,0.66rem);color:rgba(150,230,255,0.8);letter-spacing:1px;animation:fadeIn 0.3s ease;align-self:center;flex-shrink:0}",
".h-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 5px var(--green);animation:pulse 1s ease-in-out infinite alternate}",
".ll-panel{background:linear-gradient(135deg,rgba(10,0,30,0.96),rgba(25,0,60,0.92));border:1px solid rgba(123,47,255,0.28);border-radius:10px;padding:clamp(8px,2.2vw,13px);flex-shrink:0}",
".panel-title{font-family:'Exo 2',sans-serif;color:rgba(200,180,255,0.8);font-size:clamp(0.56rem,1.5vw,0.68rem);letter-spacing:2px;margin-bottom:7px;text-transform:uppercase;font-weight:700}",
".poll-row{display:flex;align-items:center;gap:6px;margin-bottom:4px}",
".poll-lbl{font-family:'Bebas Neue',sans-serif;font-size:0.8rem;color:var(--gold);width:13px;font-weight:700}",
".poll-bg{flex:1;height:clamp(10px,2.4vw,13px);background:rgba(255,255,255,0.05);border-radius:6px;overflow:hidden}",
".poll-fill{height:100%;background:linear-gradient(90deg,rgba(123,47,255,0.8),rgba(0,207,255,0.8));border-radius:6px;transition:width 0.9s ease;display:flex;align-items:center;justify-content:flex-end;padding-right:3px;font-size:0.52rem;font-weight:700;color:#fff}",
".poll-pct{width:26px;text-align:right;color:rgba(200,200,255,0.8);font-size:clamp(0.58rem,1.5vw,0.7rem)}",
".expert-txt{font-family:'Barlow',sans-serif;color:rgba(220,210,255,0.92);font-size:clamp(0.7rem,2vw,0.82rem);line-height:1.68;font-style:italic;font-weight:400}",
".q-box{background:linear-gradient(145deg,rgba(20,0,50,0.96),rgba(40,5,90,0.92));border:2px solid rgba(123,47,255,0.55);border-radius:8px;padding:clamp(11px,2.8vw,18px) clamp(13px,3.5vw,22px);text-align:center;position:relative;overflow:hidden;box-shadow:0 0 40px rgba(139,0,255,0.35),0 0 80px rgba(139,0,255,0.12);animation:qAppear 0.4s ease,borderGlow 3s ease-in-out infinite;clip-path:polygon(16px 0%,calc(100% - 16px) 0%,100% 50%,calc(100% - 16px) 100%,16px 100%,0% 50%);flex-shrink:0}",
"@keyframes qAppear{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}",
".q-box::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(123,47,255,0.07) 0%,transparent 50%);pointer-events:none}",
".q-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;flex-wrap:wrap;gap:3px}",
".q-num{font-family:'Exo 2',sans-serif;font-size:clamp(0.52rem,1.4vw,0.64rem);font-weight:700;color:rgba(200,180,255,0.7);letter-spacing:2px;text-transform:uppercase}",
".q-topic{font-family:'Exo 2',sans-serif;font-size:clamp(0.48rem,1.3vw,0.6rem);color:rgba(150,200,255,0.6);letter-spacing:1px;text-transform:uppercase}",
".q-prize-tag{font-family:'Bebas Neue',sans-serif;font-size:clamp(0.66rem,1.9vw,0.82rem);color:var(--gold);font-weight:700}",
".q-text{font-family:'Barlow',sans-serif;font-size:clamp(0.9rem,2.2vw,1.14rem);line-height:1.58;color:#fff;font-weight:500;letter-spacing:0.3px}",
".opts{display:grid;grid-template-columns:1fr 1fr;gap:clamp(5px,1.4vw,8px);flex-shrink:0}",
"@media(max-width:380px){.opts{grid-template-columns:1fr}}",
".ob{background:linear-gradient(135deg,rgba(50,0,120,0.95),rgba(90,10,180,0.9),rgba(55,2,125,0.95));border:1.5px solid rgba(140,60,255,0.65);border-radius:4px;padding:clamp(8px,2vw,12px) clamp(9px,2.5vw,14px);cursor:pointer;transition:all 0.18s;display:flex;align-items:center;gap:clamp(6px,1.5vw,9px);color:#fff;font-family:'Barlow',sans-serif;font-size:clamp(0.78rem,2vw,0.92rem);font-weight:500;position:relative;animation:optIn 0.35s ease both;clip-path:polygon(13px 0%,calc(100% - 13px) 0%,100% 50%,calc(100% - 13px) 100%,13px 100%,0% 50%);-webkit-tap-highlight-color:transparent;text-align:left}",
".ob:nth-child(1){animation-delay:0.04s}.ob:nth-child(2){animation-delay:0.08s}.ob:nth-child(3){animation-delay:0.12s}.ob:nth-child(4){animation-delay:0.16s}",
"@keyframes optIn{from{opacity:0;transform:scaleX(0.92)}to{opacity:1;transform:scaleX(1)}}",
".ob:hover:not(.filtered):not(.correct):not(.wrong):not(.wrong-locked):not([disabled]),.ob:active:not(.filtered):not(.correct):not(.wrong):not(.wrong-locked):not([disabled]){background:linear-gradient(90deg,rgba(80,20,160,0.98),rgba(100,40,200,0.95));border-color:rgba(200,100,255,0.8);box-shadow:0 0 22px rgba(139,0,255,0.6),0 0 40px rgba(139,0,255,0.2);transform:scaleX(1.01)}",
".ob.selected{background:linear-gradient(90deg,rgba(255,165,0,0.32),rgba(255,200,0,0.26));border-color:var(--gold);box-shadow:0 0 18px rgba(255,215,0,0.35);animation:selPulse 0.7s ease infinite alternate}",
"@keyframes selPulse{0%{box-shadow:0 0 8px rgba(255,215,0,0.2)}100%{box-shadow:0 0 25px rgba(255,215,0,0.55)}}",
".ob.correct{background:linear-gradient(90deg,rgba(0,180,80,0.55),rgba(0,220,100,0.45));border-color:var(--green);box-shadow:0 0 30px rgba(0,255,136,0.7),0 0 60px rgba(0,255,136,0.25);animation:correctPop 0.48s ease}",
"@keyframes correctPop{0%{transform:scaleX(1)}50%{transform:scaleX(1.03)}100%{transform:scaleX(1)}}",
".ob.wrong{background:linear-gradient(90deg,rgba(200,0,25,0.65),rgba(255,0,50,0.55));border-color:var(--red);box-shadow:0 0 30px rgba(255,17,68,0.7),0 0 60px rgba(255,17,68,0.3);animation:wrongShake 0.46s ease}",
"@keyframes wrongShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}",
".ob.filtered{opacity:0.08;cursor:not-allowed}",
".ob.wrong-locked{opacity:0.22;cursor:not-allowed;background:linear-gradient(90deg,rgba(180,0,30,0.3),rgba(220,0,40,0.25));border-color:rgba(255,34,68,0.4)}",
".opt-lbl{background:linear-gradient(135deg,rgba(255,215,0,0.9),rgba(255,165,0,0.9));color:#1a0800;font-weight:400;font-family:'Bebas Neue',sans-serif;width:clamp(22px,5.2vw,28px);height:clamp(22px,5.2vw,28px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(0.65rem,1.8vw,0.82rem);flex-shrink:0;box-shadow:0 0 5px rgba(255,215,0,0.3)}",
".ob.correct .opt-lbl{background:linear-gradient(135deg,#00C853,#00E676);color:#001a08}",
".ob.wrong .opt-lbl{background:linear-gradient(135deg,#C62828,#FF1744);color:#fff}",
".expl{font-family:'Barlow',sans-serif;background:rgba(0,100,40,0.1);border:1px solid rgba(0,255,136,0.2);border-radius:8px;padding:clamp(6px,1.7vw,9px) clamp(10px,2.5vw,14px);font-size:clamp(0.68rem,1.7vw,0.79rem);color:rgba(180,255,200,0.88);line-height:1.55;animation:fadeIn 0.4s ease;text-align:center;flex-shrink:0}",
".auto-adv{background:rgba(0,100,40,0.1);border:1px solid rgba(0,255,136,0.2);border-radius:8px;padding:clamp(6px,1.8vw,10px) 14px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;flex-shrink:0}",
".aa-txt{font-family:'Exo 2',sans-serif;font-size:clamp(0.62rem,1.7vw,0.76rem);color:var(--green);letter-spacing:1px;position:relative;z-index:1;text-transform:uppercase;font-weight:600}",
".aa-bar{position:absolute;left:0;top:0;height:100%;background:linear-gradient(90deg,rgba(0,255,136,0.14),rgba(0,255,136,0.02));width:0%;animation:aaSweep 2.6s linear forwards;border-radius:8px}",
"@keyframes aaSweep{from{width:0%}to{width:100%}}",
".btn-see-result{background:linear-gradient(135deg,rgba(123,47,255,0.9),rgba(160,80,255,0.95));border:2px solid rgba(200,150,255,0.4);border-radius:50px;padding:clamp(8px,2vw,11px) clamp(20px,5vw,32px);font-family:'Bebas Neue',sans-serif;font-size:clamp(0.8rem,2.1vw,1rem);font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;cursor:pointer;display:block;margin:0 auto;box-shadow:0 0 18px rgba(123,47,255,0.4);transition:all 0.3s;-webkit-tap-highlight-color:transparent}",
".overlay{position:fixed;inset:0;background:rgba(0,0,0,0.78);display:flex;align-items:center;justify-content:center;z-index:100;animation:fadeIn 0.25s ease;padding:16px}",
".modal{background:linear-gradient(145deg,rgba(15,0,35,0.99),rgba(30,0,70,0.96));border:2px solid rgba(123,47,255,0.5);border-radius:18px;padding:clamp(18px,5vw,26px) clamp(16px,4vw,22px);max-width:400px;width:100%;text-align:center;box-shadow:0 0 50px rgba(123,47,255,0.3);max-height:90vh;overflow-y:auto}",
".modal-emoji{font-size:clamp(2rem,7vw,2.8rem);margin-bottom:6px}",
".modal-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.4rem,5.5vw,1.9rem);color:var(--red);letter-spacing:3px;text-transform:uppercase;margin-bottom:5px;font-weight:400}",
".modal-sub{font-family:'Barlow',sans-serif;color:var(--dim);font-size:clamp(0.7rem,1.9vw,0.82rem);line-height:1.58;margin-bottom:12px}",
".modal-safe{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.6rem,6vw,2.2rem);color:var(--green);font-weight:400}",
".modal-last{background:rgba(80,50,0,0.22);border:1px solid rgba(255,215,0,0.18);border-radius:8px;padding:8px 12px;margin:9px 0 12px;text-align:left}",
".ml-lbl{font-family:'Exo 2',sans-serif;font-size:0.54rem;color:var(--dim);letter-spacing:2px;text-transform:uppercase}",
".ml-prize{font-family:'Bebas Neue',sans-serif;font-size:clamp(0.86rem,2.4vw,1rem);color:var(--gold);font-weight:700;margin-top:2px}",
".modal-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}",
".btn-c{background:linear-gradient(135deg,rgba(123,47,255,0.9),rgba(160,80,255,0.95));border:1.5px solid rgba(200,150,255,0.4);border-radius:40px;padding:clamp(8px,2vw,10px) clamp(14px,3.5vw,20px);font-family:'Exo 2',sans-serif;font-size:clamp(0.66rem,1.9vw,0.78rem);font-weight:700;color:#fff;cursor:pointer;letter-spacing:1px;text-transform:uppercase;transition:all 0.2s;-webkit-tap-highlight-color:transparent}",
".btn-q{background:linear-gradient(135deg,rgba(150,0,30,0.9),rgba(200,0,40,0.95));border:1.5px solid rgba(255,100,100,0.4);border-radius:40px;padding:clamp(8px,2vw,10px) clamp(14px,3.5vw,20px);font-family:'Exo 2',sans-serif;font-size:clamp(0.66rem,1.9vw,0.78rem);font-weight:700;color:#fff;cursor:pointer;letter-spacing:1px;text-transform:uppercase;transition:all 0.2s;-webkit-tap-highlight-color:transparent}",
".end-screen{flex:1;display:flex;align-items:center;justify-content:center;padding:clamp(14px,3vw,22px) clamp(12px,3vw,18px);overflow-y:auto}",
".end-card{background:linear-gradient(145deg,rgba(15,0,35,0.99),rgba(30,0,70,0.95));border:2px solid rgba(123,47,255,0.45);border-radius:20px;padding:clamp(20px,5vw,30px) clamp(16px,4vw,24px);max-width:500px;width:100%;text-align:center;box-shadow:0 0 60px rgba(123,47,255,0.25);animation:fadeUp 0.6s ease}",
".ec-emoji{font-size:clamp(2.2rem,7vw,3rem);margin-bottom:4px}",
".ec-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.5rem,5.5vw,2rem);color:var(--gold);letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;text-shadow:0 0 15px rgba(255,215,0,0.5);font-weight:400}",
".ec-prize{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,7vw,2.8rem);color:var(--green);font-weight:400;margin:8px 0;text-shadow:0 0 20px rgba(0,255,136,0.5)}",
".ec-sub{font-family:'Barlow',sans-serif;color:var(--dim);font-size:clamp(0.7rem,2vw,0.82rem);line-height:1.6;margin-bottom:12px}",
".ec-last{background:rgba(80,50,0,0.2);border:1px solid rgba(255,215,0,0.18);border-radius:8px;padding:8px 12px;margin-bottom:10px;text-align:left}",
".ec-ans{font-family:'Barlow',sans-serif;background:rgba(0,60,25,0.2);border:1px solid rgba(0,255,136,0.18);border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:clamp(0.66rem,1.8vw,0.78rem);color:rgba(180,255,200,0.85);text-align:left;line-height:1.55}",
".btn-again{background:linear-gradient(135deg,rgba(123,47,255,0.9),rgba(160,80,255,0.95));border:2px solid rgba(200,150,255,0.4);border-radius:50px;padding:clamp(9px,2.4vw,13px) clamp(24px,6vw,38px);font-family:'Bebas Neue',sans-serif;font-size:clamp(0.84rem,2.4vw,1.05rem);font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff;cursor:pointer;box-shadow:0 0 20px rgba(123,47,255,0.4);transition:all 0.3s;-webkit-tap-highlight-color:transparent}",
".btn-again:hover,.btn-again:active{transform:scale(1.04);box-shadow:0 0 36px rgba(123,47,255,0.7)}",
".conf{position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden}",
".cd{position:absolute;animation:cdFall linear both}",
"@keyframes cdFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}",
".fff-screen{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:clamp(12px,3vw,22px) clamp(10px,3vw,16px);overflow-y:auto}",
".fff-card{background:linear-gradient(145deg,rgba(10,0,30,0.99),rgba(25,0,65,0.96));border:2px solid rgba(255,215,0,0.45);border-radius:18px;padding:clamp(16px,4vw,26px) clamp(14px,3.5vw,22px);max-width:600px;width:100%;box-shadow:0 0 60px rgba(255,215,0,0.15);animation:fadeUp 0.5s ease}",
".fff-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.5rem,6vw,2.1rem);letter-spacing:3px;text-transform:uppercase;color:var(--gold);text-align:center;margin-bottom:4px;font-weight:400}",
".fff-sub{font-family:'Exo 2',sans-serif;font-size:clamp(0.6rem,1.7vw,0.76rem);color:rgba(200,180,255,0.7);letter-spacing:2px;text-transform:uppercase;text-align:center;margin-bottom:8px}",
".fff-rule{font-family:'Barlow',sans-serif;font-size:clamp(0.7rem,1.9vw,0.82rem);color:rgba(220,210,255,0.8);text-align:center;background:rgba(60,10,120,0.28);border:1px solid rgba(123,47,255,0.22);border-radius:8px;padding:clamp(7px,2vw,9px) 13px;margin-bottom:12px}",
".fff-countdown-phase{text-align:center;padding:clamp(14px,4vw,22px) 0}",
".fff-big-count{font-family:'Bebas Neue',sans-serif;font-size:clamp(4rem,18vw,7rem);font-weight:400;color:var(--gold);text-shadow:0 0 40px rgba(255,215,0,0.9);animation:cntPop 0.4s ease;line-height:1}",
"@keyframes cntPop{0%{transform:scale(1.4);opacity:0.5}100%{transform:scale(1);opacity:1}}",
".fff-playing{display:flex;flex-direction:column;gap:clamp(8px,2.4vw,13px)}",
".fff-header-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px}",
".fff-title-sm{font-family:'Bebas Neue',sans-serif;font-size:clamp(0.88rem,2.4vw,1.08rem);letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:700}",
".fff-timer-ring{display:flex;flex-direction:column;align-items:center;justify-content:center;width:clamp(44px,11vw,60px);height:clamp(44px,11vw,60px);border-radius:50%;border:3px solid rgba(255,215,0,0.6);background:rgba(40,25,0,0.6);box-shadow:0 0 14px rgba(255,215,0,0.3);flex-shrink:0}",
".fff-timer-ring.fff-urgent{border-color:var(--red);background:rgba(60,0,10,0.7);animation:urgentPulse 0.35s ease-in-out infinite alternate}",
".fff-timer-num{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.3rem,4vw,1.8rem);font-weight:400;color:var(--gold);line-height:1}",
".fff-timer-ring.fff-urgent .fff-timer-num{color:var(--red)}",
".fff-timer-lbl{font-family:'Exo 2',sans-serif;font-size:0.42rem;color:var(--dim);letter-spacing:1px;text-transform:uppercase;line-height:1}",
".fff-question{font-family:'Barlow',sans-serif;font-size:clamp(0.82rem,2.1vw,1rem);font-weight:600;color:#fff;text-align:center;background:linear-gradient(135deg,rgba(20,0,50,0.95),rgba(40,5,90,0.9));border:1.5px solid rgba(123,47,255,0.4);border-radius:8px;padding:clamp(10px,2.5vw,14px) clamp(12px,3vw,18px);clip-path:polygon(12px 0%,calc(100% - 12px) 0%,100% 50%,calc(100% - 12px) 100%,12px 100%,0% 50%)}",
".fff-opts{display:grid;grid-template-columns:1fr 1fr;gap:clamp(5px,1.6vw,9px)}",
"@media(max-width:380px){.fff-opts{grid-template-columns:1fr}}",
".fff-opt{background:linear-gradient(90deg,rgba(50,10,110,0.9),rgba(70,20,140,0.85));border:1.5px solid rgba(123,47,255,0.5);border-radius:4px;padding:clamp(8px,2vw,11px) clamp(10px,2.5vw,14px);cursor:pointer;transition:all 0.18s;display:flex;align-items:center;gap:clamp(5px,1.4vw,8px);color:#fff;font-family:'Barlow',sans-serif;font-size:clamp(0.74rem,1.9vw,0.88rem);font-weight:500;clip-path:polygon(11px 0%,calc(100% - 11px) 0%,100% 50%,calc(100% - 11px) 100%,11px 100%,0% 50%);-webkit-tap-highlight-color:transparent;text-align:left}",
".fff-opt:hover,.fff-opt:active{background:linear-gradient(90deg,rgba(80,20,160,0.95),rgba(100,40,190,0.9));border-color:rgba(200,100,255,0.8)}",
".fff-opt-clicked{background:linear-gradient(90deg,rgba(180,130,0,0.5),rgba(220,170,0,0.45));border-color:var(--gold);cursor:default}",
".fff-opt-lbl{background:linear-gradient(135deg,rgba(255,215,0,0.85),rgba(255,165,0,0.85));color:#1a0800;font-weight:800;font-family:'Bebas Neue',sans-serif;width:clamp(19px,5vw,24px);height:clamp(19px,5vw,24px);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:clamp(0.6rem,1.6vw,0.72rem);flex-shrink:0}",
".fff-opt-txt{flex:1;text-align:left}",
".fff-opt-pos{background:rgba(255,215,0,0.9);color:#1a0800;font-family:'Bebas Neue',sans-serif;font-weight:800;font-size:0.7rem;width:19px;height:19px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;animation:popIn 0.2s ease}",
"@keyframes popIn{0%{transform:scale(0)}100%{transform:scale(1)}}",
".fff-selected-row{font-family:'Exo 2',sans-serif;font-size:clamp(0.66rem,1.7vw,0.78rem);color:rgba(200,180,255,0.8);text-align:center;letter-spacing:1px;padding:3px 0}",
".fff-result{display:flex;flex-direction:column;align-items:center;gap:clamp(7px,2vw,11px);text-align:center}",
".fff-result-icon{font-size:clamp(2.2rem,7vw,3rem);animation:popIn 0.4s ease}",
".fff-result-sub{font-family:'Barlow',sans-serif;font-size:clamp(0.72rem,1.9vw,0.84rem);color:rgba(200,190,255,0.8);line-height:1.55;max-width:400px}",
".fff-answer-row{display:flex;flex-direction:column;gap:5px;width:100%;max-width:420px}",
".fff-ans-item{display:flex;align-items:center;gap:7px;background:rgba(0,180,80,0.1);border:1px solid rgba(0,255,136,0.22);border-radius:8px;padding:clamp(6px,1.8vw,8px) 12px}",
".fff-ans-pos{background:var(--green);color:#001a08;font-family:'Bebas Neue',sans-serif;font-weight:800;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.66rem;flex-shrink:0}",
".fff-ans-lbl{background:rgba(255,215,0,0.85);color:#1a0800;font-family:'Bebas Neue',sans-serif;font-weight:800;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.64rem;flex-shrink:0}",
".fff-ans-txt{font-family:'Barlow',sans-serif;font-size:clamp(0.72rem,1.9vw,0.84rem);font-weight:500;color:#fff;flex:1;text-align:left}",
".fff-your-row{font-family:'Exo 2',sans-serif;font-size:clamp(0.68rem,1.8vw,0.8rem);color:rgba(255,150,150,0.8);letter-spacing:1px}",
".fff-retry-btn{background:rgba(60,10,120,0.7);border:1.5px solid rgba(123,47,255,0.5);border-radius:40px;padding:clamp(8px,2vw,10px) clamp(18px,5vw,24px);font-family:'Exo 2',sans-serif;font-size:clamp(0.68rem,1.8vw,0.8rem);font-weight:700;color:rgba(200,180,255,0.9);cursor:pointer;letter-spacing:1px;text-transform:uppercase;transition:all 0.2s;-webkit-tap-highlight-color:transparent}",
".fff-retry-btn:hover,.fff-retry-btn:active{border-color:var(--glow2);box-shadow:0 0 13px rgba(123,47,255,0.4)}",
"@media(max-width:360px){.opts{gap:4px}.ob{padding:7px 8px;font-size:0.72rem}.opt-lbl{width:18px;height:18px;font-size:0.56rem}.q-box{clip-path:none;border-radius:10px}.fff-question{clip-path:none;border-radius:8px}.lifeline-bar{gap:2px;padding:4px 5px}.ll-label{display:none}}",
"@media(max-height:600px) and (max-width:750px){.hdr{padding:5px 12px 3px}.ll-label{display:none}.prize-strip{padding:3px}.game-layout{padding:3px 6px}.game-center{gap:3px}}",
"@media(min-width:1024px){.game-center{padding-right:14px}.q-text{font-size:1.12rem}.ob{font-size:0.9rem}}",
".arc-timer-wrap{display:flex;flex-direction:column;align-items:center;position:relative;flex-shrink:0;margin:0 auto}",
".arc-timer-svg{width:clamp(90px,22vw,130px);height:clamp(50px,12vw,70px);overflow:visible}",
".arc-timer-num{position:absolute;top:clamp(14px,4vw,22px);font-family:'Bebas Neue',sans-serif;font-size:clamp(1.4rem,5vw,2rem);font-weight:400;color:var(--gold);line-height:1;text-align:center;width:100%}",
".arc-timer-num.warn{color:orange}",
".arc-timer-num.urgent{color:var(--red);animation:urgentPulse 0.35s ease-in-out infinite alternate}",
".arc-timer-lbl{font-family:'Exo 2',sans-serif;font-size:clamp(0.44rem,1.2vw,0.56rem);color:rgba(255,215,0,0.65);letter-spacing:2px;text-transform:uppercase;margin-top:-2px}",
".ll-mic{font-size:clamp(0.9rem,2.2vw,1.1rem);cursor:pointer;flex-shrink:0;opacity:0.7;transition:all 0.2s;padding:clamp(3px,0.8vw,5px) clamp(6px,1.5vw,9px);border-radius:8px;border:1px solid rgba(0,255,136,0.25);background:rgba(0,40,20,0.4);-webkit-tap-highlight-color:transparent}",
".ll-mic:hover,.ll-mic:active{opacity:1;border-color:rgba(0,255,136,0.6);background:rgba(0,60,30,0.6)}",
".ll-mic.active{opacity:1;border-color:var(--green);background:rgba(0,80,40,0.6);animation:micPulse 0.6s ease-in-out infinite alternate;box-shadow:0 0 10px rgba(0,255,136,0.4)}",
"@keyframes micPulse{0%{opacity:0.6}100%{opacity:1}}",
".expl-full{background:linear-gradient(135deg,rgba(8,0,25,0.98),rgba(20,0,50,0.96));border:1.5px solid rgba(139,0,255,0.4);border-radius:12px;padding:clamp(10px,2.5vw,16px);flex-shrink:0;animation:fadeIn 0.4s ease;display:flex;flex-direction:column;gap:8px}",
".expl-header{font-family:'Barlow',sans-serif;font-size:clamp(0.8rem,2vw,0.95rem);font-weight:600;padding:8px 12px;border-radius:8px;line-height:1.4}",
".expl-header.correct{background:rgba(0,180,80,0.15);border:1px solid rgba(0,255,136,0.3);color:var(--green)}",
".expl-header.wrong{background:rgba(200,0,30,0.15);border:1px solid rgba(255,26,60,0.3);color:rgba(255,130,130,0.95)}",
".expl-header strong{color:#fff}",
".expl-body{font-family:'Barlow',sans-serif;font-size:clamp(0.72rem,1.8vw,0.84rem);color:rgba(220,210,255,0.9);line-height:1.6;padding:6px 10px;background:rgba(139,0,255,0.08);border-radius:6px;border-left:3px solid rgba(180,77,255,0.5)}",
".expl-options{display:flex;flex-direction:column;gap:5px}",
".expl-opt{display:flex;align-items:center;gap:8px;padding:clamp(5px,1.5vw,8px) 10px;border-radius:7px;font-family:'Barlow',sans-serif;font-size:clamp(0.7rem,1.7vw,0.8rem)}",
".expl-opt.expl-correct{background:rgba(0,180,80,0.18);border:1px solid rgba(0,255,136,0.35);color:rgba(180,255,200,0.95)}",
".expl-opt.expl-wrong{background:rgba(255,255,255,0.04);border:1px solid rgba(139,0,255,0.2);color:rgba(180,170,210,0.75)}",
".expl-opt-lbl{font-family:'Bebas Neue',sans-serif;font-size:clamp(0.75rem,1.8vw,0.9rem);background:rgba(255,215,0,0.85);color:#1a0800;width:clamp(20px,5vw,24px);height:clamp(20px,5vw,24px);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
".expl-opt.expl-correct .expl-opt-lbl{background:var(--green);color:#001a08}",
".expl-opt-txt{flex:1;font-weight:500}",
".expl-tick{font-family:'Exo 2',sans-serif;font-size:0.58rem;font-weight:700;letter-spacing:1px;color:var(--green);text-transform:uppercase;background:rgba(0,180,80,0.2);border:1px solid rgba(0,255,136,0.4);border-radius:20px;padding:2px 7px;flex-shrink:0}",
".voice-banner{background:linear-gradient(90deg,rgba(0,180,80,0.15),rgba(0,220,100,0.1));border:1px solid rgba(0,255,136,0.4);border-radius:8px;padding:clamp(5px,1.2vw,7px) 14px;text-align:center;font-family:'Exo 2',sans-serif;font-size:clamp(0.62rem,1.7vw,0.76rem);font-weight:700;color:var(--green);letter-spacing:1px;animation:fadeIn 0.3s ease;display:flex;align-items:center;justify-content:center;flex-shrink:0}",
].join("\n");


// Audio base64 data

// MAIN COMPONENT
export default function KaunBanegaGenius() {
  // Screens: rules | fastest | playing | gameover | result
  var [screen, setScreen] = useState("rules");

  // FFF state
  var [fffQ, setFffQ] = useState(null);
  var [fffOrder, setFffOrder] = useState([]);
  var [fffTimer, setFffTimer] = useState(15);
  var [fffDone, setFffDone] = useState(false);
  var [fffCorrect, setFffCorrect] = useState(false);
  var fffTimerRef = useRef(null);
  var [fffCountdown, setFffCountdown] = useState(3);
  var [fffPhase, setFffPhase] = useState("idle");

  // Game state
  var [questions, setQuestions] = useState([]);
  var [currentQ, setCurrentQ] = useState(0);
  var [loadingQ, setLoadingQ] = useState(false);
  var [selected, setSelected] = useState(null);
  var [revealed, setRevealed] = useState(false);
  var [winnings, setWinnings] = useState("0");
  var [safeWin, setSafeWin] = useState("0");
  var [lastPrize, setLastPrize] = useState(null);
  var [usedTopics, setUsedTopics] = useState([]);
  var [usedQs, setUsedQs] = useState([]);
  var [timeLeft, setTimeLeft] = useState(null);
  var [timerOn, setTimerOn] = useState(false);
  var timerRef = useRef(null);

  // Lifelines
  var [lifelines, setLifelines] = useState({ fifty: true, audience: true, expert: true, double: true });
  var [doubleActive, setDoubleActive] = useState(false);
  var [firstWrongIdx, setFirstWrongIdx] = useState(null);
  var [poll, setPoll] = useState(null);
  var [filtered, setFiltered] = useState(null);
  var [expertTxt, setExpertTxt] = useState(null);
  var [expertLoad, setExpertLoad] = useState(false);
  var [showPoll, setShowPoll] = useState(false);
  var [showExpert, setShowExpert] = useState(false);

  // Hindi
  var [isHindi, setIsHindi] = useState(false);
  var [hindiData, setHindiData] = useState(null);
  var [hindiReady, setHindiReady] = useState(false);
  var [hindiLoading, setHindiLoading] = useState(false);

  // UI
  var [showQuit, setShowQuit] = useState(false);



  // -- TICK AUDIO ENGINE --------------------------------------
  var acRef = useRef(null);

  var getAC = function() {
    if (!acRef.current) {
      try { acRef.current = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; }
    }
    var ac = acRef.current;
    if (ac.state === 'suspended') { try { ac.resume(); } catch(e) {} }
    return ac;
  };

  var initAudio = function() { getAC(); };

  // Clean single tick - same consistent sound every second
  var playTick = function() {
    try {
      var ac = getAC();
      if (!ac) return;
      var t = ac.currentTime;
      var o = ac.createOscillator();
      var g = ac.createGain();
      o.connect(g);
      g.connect(ac.destination);
      o.type = 'sine';
      o.frequency.value = 800;
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.start(t);
      o.stop(t + 0.09);
    } catch(e) {}
  };
  // -----------------------------------------------------------

  var q = questions[currentQ];
  var dq = (isHindi && hindiData) ? Object.assign({}, q, { question: hindiData.question, options: hindiData.options, explanation: hindiData.explanation }) : q;

  // TIMER
  var stopTimer = useCallback(function() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setTimerOn(false);
  }, []);

  useEffect(function() {
    if (!timerOn || timeLeft === null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    // Use a local variable to track time - avoids stale closure
    var remaining = timeLeft;
    timerRef.current = setInterval(function() {
      remaining = remaining - 1;
      // Play tick directly in interval callback - this works reliably
      playTick();
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setTimeLeft(0);
        setTimerOn(false);
        setTimeout(function() {
          setRevealed(true);
          setSelected(-1);
          setTimeout(function() { setScreen("gameover"); }, 2500);
        }, 500);
        return;
      }
      setTimeLeft(remaining);
    }, 1000);
    return function() { clearInterval(timerRef.current); };
  }, [timerOn]);

  // Pre-translate when question loads
  useEffect(function() {
    setHindiData(null);
    setHindiReady(false);
    setIsHindi(false);
    setHindiLoading(false);
  }, [currentQ]);

  // Translate on demand when user clicks button - triggered by hindiLoading flag
  useEffect(function() {
    if (!hindiLoading || !q || !q.question || !q.options) return;
    var cancelled = false;
    translateQ(q).then(function(hd) {
      if (cancelled) return;
      if (hd && hd.question && Array.isArray(hd.options) && hd.options.length === 4) {
        setHindiData(hd);
        setHindiReady(true);
        setIsHindi(true);
      }
      setHindiLoading(false);
    }).catch(function() {
      if (!cancelled) setHindiLoading(false);
    });
    return function() { cancelled = true; };
  }, [hindiLoading, currentQ]);

  // Cleanup on unmount
  useEffect(function() {
    return function() {
      stopTimer();
      if (fffTimerRef.current) clearInterval(fffTimerRef.current);
    };
  }, []);

  var loadQ = useCallback(async function(index) {
    setLoadingQ(true);
    stopTimer();
    setSelected(null);
    setRevealed(false);
    setFiltered(null);
    setPoll(null);
    setExpertTxt(null);
    setShowPoll(false);
    setShowExpert(false);
    setDoubleActive(false);
    setFirstWrongIdx(null);
    try {
      var data = await fetchQ(index, [], []);
      setQuestions(function(prev) { var u = prev.slice(); u[index] = data; return u; });
      setLoadingQ(false);
      var secs = getTimer(index);
      if (secs !== null) { setTimeLeft(secs); setTimerOn(true); }
      else { setTimeLeft(null); setTimerOn(false); }
    } catch(e) {
      console.error(e);
      setLoadingQ(false);
    }
  }, [stopTimer]);

  // FFF
  var startFFF = async function() {
    setScreen("fastest");
    setFffQ(null);
    setFffOrder([]);
    setFffDone(false);
    setFffCorrect(false);
    setFffPhase("idle");
    setFffCountdown(3);
    setFffTimer(15);
    if (fffTimerRef.current) { clearInterval(fffTimerRef.current); fffTimerRef.current = null; }
    try {
      var fq = await fetchFFFQ();
      setFffQ(fq);
      setFffPhase("countdown");
      var count = 3;
      setFffCountdown(count);
      var cdInterval = setInterval(function() {
        count--;
        if (count <= 0) {
          clearInterval(cdInterval);
          setFffCountdown(0);
          setTimeout(function() {
            setFffPhase("playing");
            var t = 15;
            setFffTimer(t);
            fffTimerRef.current = setInterval(function() {
              t--;
              playTick();
              setFffTimer(t);
              if (t <= 0) {
                clearInterval(fffTimerRef.current);
                setFffDone(true);
                setFffPhase("result");
                setFffCorrect(false);
              }
            }, 1000);
          }, 400);
        } else {
          setFffCountdown(count);
        }
      }, 800);
    } catch(e) {
      console.error(e);
      setFffPhase("error");
    }
  };

  var handleFFFClick = function(idx) {
    if (fffDone) return;
    setFffOrder(function(prev) {
      if (prev.indexOf(idx) >= 0) return prev;
      var next = prev.concat([idx]);
      if (next.length === 4) {
        clearInterval(fffTimerRef.current);
        setFffDone(true);
        setFffPhase("result");
        setFffQ(function(fq) {
          if (!fq) return fq;
          var isCorrect = next.every(function(v, i) { return v === fq.correctOrder[i]; });
          setFffCorrect(isCorrect);
          return fq;
        });
      }
      return next;
    });
  };

  var startGame = async function() {
    resetUsedQuestions(); // reset so no repeated questions this game
    setScreen("playing");
    setCurrentQ(0);
    setQuestions([]);
    setWinnings("0");
    setSafeWin("0");
    setLastPrize(null);
    setUsedTopics([]);
    setUsedQs([]);
    setLifelines({ fifty: true, audience: true, expert: true, double: true });
    setDoubleActive(false);
    setFirstWrongIdx(null);
    setLoadingQ(true);
    await loadQ(0);
  };

  var handleSelect = function(idx) {
    initAudio();
    if (revealed || !q) return;
    if (filtered && filtered[idx] === null) return;
    if (firstWrongIdx !== null && idx === firstWrongIdx) return;
    if (selected !== null && firstWrongIdx === null) return;

    stopTimer();
    setSelected(idx);

    setTimeout(function() {
      var ok = idx === q.correct;
      if (ok) {
        // CORRECT
        setRevealed(true);
        setDoubleActive(false);
        setFirstWrongIdx(null);
        var prize = PRIZE_LADDER[currentQ].prize;
        setWinnings(prize);
        setLastPrize(prize);
        if (PRIZE_LADDER[currentQ].safe) setSafeWin(prize);
        if (currentQ === 15) {
          setTimeout(function() { setScreen("result"); }, 3000);
        } else {
          setTimeout(async function() {
            var next = currentQ + 1;
            setCurrentQ(next);
            await loadQ(next);
          }, 2800);
        }
      } else if (doubleActive && firstWrongIdx === null) {
        // FIRST WRONG with Double Chance pre-activated - give second try
        setFirstWrongIdx(idx);
        setDoubleActive(false);
        setTimeout(function() {
          setSelected(null);
          var secs = getTimer(currentQ);
          if (secs !== null) {
            setTimeLeft(Math.max(10, Math.floor(secs * 0.45)));
            setTimerOn(true);
          }
        }, 900);
      } else {
        // WRONG - game over
        setRevealed(true);
        setDoubleActive(false);
      }
    }, 1200);
  };

  // LIFELINES
  var use5050 = function() {
    if (!lifelines.fifty || !q || selected !== null) return;
    setLifelines(function(p) { return Object.assign({}, p, { fifty: false }); });
    stopTimer();
    setFiltered(do5050(q.options, q.correct));
    setTimeout(function() {
      if (getTimer(currentQ) !== null && timeLeft !== null && timeLeft > 0) setTimerOn(true);
    }, 2000);
  };

  var useAudience = function() {
    if (!lifelines.audience || !q || selected !== null) return;
    setLifelines(function(p) { return Object.assign({}, p, { audience: false }); });
    stopTimer();
    setPoll(makePoll(q.correct));
    setShowPoll(true);
    // Resume timer after poll - use functional update to get fresh timeLeft
    setTimeout(function() {
      if (getTimer(currentQ) !== null) {
        setTimeLeft(function(cur) {
          if (cur !== null && cur > 0) { setTimerOn(true); }
          return cur;
        });
      }
    }, 3000);
  };

  var useExpert = async function() {
    if (!lifelines.expert || !q || selected !== null) return;
    setLifelines(function(p) { return Object.assign({}, p, { expert: false }); });
    stopTimer();
    setExpertLoad(true);
    setShowExpert(true);
    var txt = await expertOpinion(q.question, filtered || q.options, q.correct);
    setExpertTxt(txt);
    setExpertLoad(false);
    setTimeout(function() {
      if (getTimer(currentQ) !== null) {
        setTimeLeft(function(cur) {
          if (cur !== null && cur > 0) { setTimerOn(true); }
          return cur;
        });
      }
    }, 4000);
  };

  var useDouble = function() {
    if (!lifelines.double || !q) return;
    setLifelines(function(p) { return Object.assign({}, p, { double: false }); });
    if (revealed && selected !== null && selected !== q.correct) {
      // Used AFTER seeing wrong answer
      setFirstWrongIdx(selected);
      setDoubleActive(false);
      setRevealed(false);
      setSelected(null);
      stopTimer();
      var secs = getTimer(currentQ);
      if (secs !== null) {
        setTimeLeft(Math.max(10, Math.floor(secs * 0.45)));
        setTimerOn(true);
      }
    } else if (!revealed && selected === null) {
      // Used BEFORE answering
      setDoubleActive(true);
      stopTimer();
    }
  };

  var handleTranslate = function() {
    if (isHindi) {
      // Already in Hindi - switch back to English
      setIsHindi(false);
    } else if (hindiReady && hindiData) {
      // Translation already done - just switch on
      setIsHindi(true);
    } else if (!hindiLoading) {
      // First time click - trigger translation
      setHindiLoading(true);
    }
  };

  var optCls = function(idx) {
    if (filtered && filtered[idx] === null) return "ob filtered";
    if (firstWrongIdx !== null && idx === firstWrongIdx && !revealed) return "ob wrong-locked";
    if (!revealed) return selected === idx ? "ob selected" : "ob";
    if (idx === q.correct) return "ob correct";
    if (idx === selected && selected !== q.correct) return "ob wrong";
    if (idx === firstWrongIdx) return "ob wrong";
    return "ob";
  };

  var timerTotal = getTimer(currentQ);
  var timerUrgent = timeLeft !== null && timeLeft <= 10;
  var timerWarn = timeLeft !== null && timerTotal && timeLeft <= Math.floor(timerTotal / 2) && !timerUrgent;
  var timerCls = "ll-timer" + (timerUrgent ? " urgent" : timerWarn ? " warn" : "");
  var trCls = "hbtn tr" + (isHindi ? " on" : hindiLoading ? " loading" : hindiReady ? " rdy" : "");
  var trLbl = isHindi ? "English" : hindiLoading ? "Translating..." : "Translate";

  function PrizePanel() {
    return React.createElement("div", { className: "prize-panel" },
      React.createElement("div", { className: "prize-box" },
        React.createElement("div", { className: "prize-header" }, "Prize Ladder"),
        React.createElement("div", { className: "prize-list" },
          PRIZE_LADDER.slice().reverse().map(function(row, ri) {
            var i = 16 - ri;
            var isActive = i === currentQ;
            var isPassed = i < currentQ;
            var cls = "prow"
              + (isActive ? " active" : isPassed ? " passed" : " upcoming")
              + (row.safe ? " safe-r" : "");
            // Format prize: show "7 Crore" for 7,00,00,000; "1 Crore" for 1,00,00,000
            var prizeDisplay = row.prize === "7,00,00,000" ? "7 Crores"
              : row.prize === "1,00,00,000" ? "1 Crore"
              : row.prize;
            return React.createElement("div", { key: i, className: cls },
              React.createElement("span", { className: "prow-q" }, row.q),
              !isActive && React.createElement("span", {
                style: {
                  color: row.safe ? "rgba(255,215,0,0.6)" : "rgba(160,130,255,0.45)",
                  fontSize: "0.5rem",
                  flexShrink: 0,
                  width: "12px",
                  textAlign: "center",
                  lineHeight: 1
                }
              }, row.safe ? "◆" : "◇"),
              isActive && React.createElement("span", {
                style: { width: "12px", flexShrink: 0 }
              }),
              React.createElement("span", { className: "prow-p" }, prizeDisplay)
            );
          })
        )
      )
    );
  }

  function PrizeStrip() {
    return React.createElement("div", { className: "prize-strip" },
      PRIZE_LADDER.map(function(row, i) {
        var cls = "ps-n" + (i === currentQ ? " active" : i < currentQ ? " passed" : "");
        return React.createElement("div", { key: i, className: cls, title: "Q" + row.q + ": Rs." + row.prize },
          React.createElement("div", { className: "ps-dot" }, row.q),
          React.createElement("div", { className: "ps-amt" }, row.prize.split(",")[0])
        );
      })
    );
  }

  function ConfettiRain() {
    var cols = ["#FFD700","#00E676","#7b2fff","#FF4081","#00BCD4","#FF9800","#E040FB","#fff","#FF6D00"];
    var dots = [];
    for (var i = 0; i < 80; i++) {
      dots.push({ id: i, left: (Math.random() * 100) + "%", color: cols[Math.floor(Math.random() * cols.length)], dur: (1.4 + Math.random() * 2.8) + "s", delay: (Math.random() * 2) + "s", size: (4 + Math.random() * 10) + "px", br: Math.random() > 0.5 ? "50%" : "2px" });
    }
    return React.createElement("div", { className: "conf" },
      dots.map(function(d) {
        return React.createElement("div", { key: d.id, className: "cd", style: { left: d.left, top: "-20px", background: d.color, width: d.size, height: d.size, borderRadius: d.br, animationDuration: d.dur, animationDelay: d.delay } });
      })
    );
  }

  return React.createElement("div", null,
    React.createElement("style", null, CSS),
    React.createElement("div", { className: "app" },
      React.createElement("div", { className: "content" },

        // HEADER
        React.createElement("div", { className: "hdr" },
          React.createElement("div", { className: "logo" }, APP_NAME),
          React.createElement("div", { className: "logo-sub" }, "Who Will Become a Genius?"),
          React.createElement("div", { className: "hdr-btns" },
            screen === "playing" && React.createElement("button", { className: trCls, onClick: handleTranslate, disabled: hindiLoading }, trLbl),
            screen === "playing" && React.createElement("button", { className: "hbtn exit", onClick: function() { stopTimer(); setShowQuit(true); } }, "Exit")
          )
        ),

        // RULES SCREEN
        screen === "rules" && React.createElement("div", { className: "rules-screen" },
          React.createElement("div", { className: "rules-card" },
            React.createElement("div", { className: "rules-title" }, APP_NAME),
            React.createElement("div", { className: "rules-sub" }, "Read the rules carefully before you begin"),
            GAME_RULES.map(function(r, i) {
              return React.createElement("div", { key: i, className: "rule-item" },
                React.createElement("span", { className: "rule-num" }, i + 1),
                React.createElement("span", { className: "rule-txt" }, r)
              );
            }),
            React.createElement("button", { className: "btn-play", onClick: function() { initAudio(); startFFF(); } }, "Play - Fastest Finger First")
          )
        ),

        // FFF SCREEN
        screen === "fastest" && React.createElement("div", { className: "fff-screen" },
          React.createElement("div", { className: "fff-card" },
            fffPhase === "idle" && React.createElement("div", { style: { textAlign: "center" } },
              React.createElement("div", { className: "fff-title" }, "Fastest Finger First"),
              React.createElement("div", { className: "fff-sub" }, "Arrange 4 items in correct order"),
              React.createElement("div", { className: "fff-rule" }, "You have 15 seconds to arrange all 4 items in the correct sequence!"),
              React.createElement("div", { className: "loader", style: { margin: "18px auto" } }),
              React.createElement("div", { className: "load-sub" }, "Loading question...")
            ),
            fffPhase === "error" && React.createElement("div", { style: { textAlign: "center", padding: "10px 0" } },
              React.createElement("div", { className: "fff-title" }, "Oops!"),
              React.createElement("div", { style: { fontSize: "2.5rem", margin: "10px 0" } }, "😔"),
              React.createElement("div", { className: "fff-rule", style: { color: "rgba(255,150,150,0.9)", borderColor: "rgba(255,34,68,0.3)", marginBottom: "16px" } }, "Could not load the question. Please check your internet connection and try again."),
              React.createElement("button", { className: "btn-play", style: { fontSize: "0.9rem", padding: "11px 28px", marginTop: "0" }, onClick: function() { initAudio(); startFFF(); } }, "Try Again"),
              React.createElement("button", { className: "fff-retry-btn", style: { display: "block", margin: "10px auto 0" }, onClick: function() { setScreen("rules"); } }, "Back to Rules")
            ),
            fffPhase === "countdown" && fffQ && React.createElement("div", { className: "fff-countdown-phase" },
              React.createElement("div", { className: "fff-title" }, "Fastest Finger First"),
              React.createElement("div", { className: "fff-sub" }, "Get ready..."),
              React.createElement("div", { className: "fff-big-count" }, fffCountdown > 0 ? fffCountdown : "GO!")
            ),
            fffPhase === "playing" && fffQ && React.createElement("div", { className: "fff-playing" },
              React.createElement("div", { className: "fff-header-row" },
                React.createElement("div", { className: "fff-title-sm" }, "Fastest Finger First"),
                React.createElement("div", { className: "fff-timer-ring" + (fffTimer <= 3 ? " fff-urgent" : "") },
                  React.createElement("span", { className: "fff-timer-num" }, fffTimer),
                  React.createElement("span", { className: "fff-timer-lbl" }, "sec")
                )
              ),
              React.createElement("div", { className: "fff-question" }, fffQ.question),
              React.createElement("div", { className: "fff-opts" },
                fffQ.options.map(function(opt, i) {
                  var clickedPos = fffOrder.indexOf(i);
                  var cls = "fff-opt" + (clickedPos >= 0 ? " fff-opt-clicked" : "");
                  var capturedIdx = i;
                  return React.createElement("button", { key: capturedIdx, className: cls, onClick: function() { handleFFFClick(capturedIdx); } },
                    React.createElement("span", { className: "fff-opt-lbl" }, LABELS[capturedIdx]),
                    React.createElement("span", { className: "fff-opt-txt" }, opt),
                    clickedPos >= 0 && React.createElement("span", { className: "fff-opt-pos" }, clickedPos + 1)
                  );
                })
              ),
              fffOrder.length > 0 && React.createElement("div", { className: "fff-selected-row" },
                "Your order: " + fffOrder.map(function(i) { return LABELS[i]; }).join(" -> ")
              )
            ),
            fffPhase === "result" && fffQ && React.createElement("div", { className: "fff-result" },
              React.createElement("div", { className: "fff-title" }, fffCorrect ? "Correct!" : "Wrong Order!"),
              React.createElement("div", { className: "fff-result-icon" }, fffCorrect ? "🎉" : "😔"),
              React.createElement("div", { className: "fff-result-sub" },
                fffCorrect ? "You got it right! Entering the Hot Seat now..." : "The correct order was:"
              ),
              React.createElement("div", { className: "fff-answer-row" },
                fffQ.correctOrder.map(function(optIdx, pos) {
                  return React.createElement("div", { key: pos, className: "fff-ans-item" },
                    React.createElement("span", { className: "fff-ans-pos" }, pos + 1),
                    React.createElement("span", { className: "fff-ans-lbl" }, LABELS[optIdx]),
                    React.createElement("span", { className: "fff-ans-txt" }, fffQ.options[optIdx])
                  );
                })
              ),
              !fffCorrect && React.createElement("div", { className: "fff-your-row" },
                "Your order: " + (fffOrder.length === 4 ? fffOrder.map(function(i) { return LABELS[i]; }).join(" -> ") : "(Time ran out)")
              ),
              React.createElement("div", { style: { display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" } },
                fffCorrect
                  ? React.createElement("button", { className: "btn-play", style: { marginTop: "14px", fontSize: "0.88rem", padding: "11px 30px" }, onClick: function() { initAudio(); startGame(); } }, "Let's Play!")
                  : React.createElement("div", null,
                      React.createElement("div", { style: { fontFamily: "'Exo 2',sans-serif", fontSize: "0.8rem", color: "rgba(255,100,100,0.9)", letterSpacing: "1px", marginBottom: "11px", textAlign: "center" } }, "Wrong answer in FFF - You cannot enter the Hot Seat."),
                      React.createElement("button", { className: "fff-retry-btn", onClick: function() { initAudio(); startFFF(); } }, "Try Again")
                    )
              )
            )
          )
        ),

        // LOADING (first question)
        screen === "playing" && loadingQ && !q && React.createElement("div", { className: "load-screen" },
          React.createElement("div", { className: "loader" }),
          React.createElement("div", { className: "load-txt" }, "Loading Question"),
          React.createElement("div", { className: "load-sub" }, "AI generating a unique question...")
        ),

        // PLAYING
        screen === "playing" && (q || loadingQ) && React.createElement("div", { className: "game-layout" },
          React.createElement("div", { className: "game-center" },

            React.createElement(PrizeStrip),

            // LIFELINE BAR
            // Arc Timer above question box
            timerTotal !== null && timeLeft !== null && React.createElement("div", { className: "arc-timer-wrap" },
              React.createElement("svg", { viewBox: "0 0 120 65", className: "arc-timer-svg" },
                React.createElement("path", { d: "M10,60 A50,50 0 0,1 110,60", fill: "none", stroke: "rgba(255,215,0,0.15)", strokeWidth: "8", strokeLinecap: "round" }),
                React.createElement("path", {
                  d: "M10,60 A50,50 0 0,1 110,60",
                  fill: "none",
                  stroke: timerUrgent ? "var(--red)" : timerWarn ? "orange" : "var(--gold)",
                  strokeWidth: "8",
                  strokeLinecap: "round",
                  strokeDasharray: "157",
                  strokeDashoffset: String(157 - (157 * Math.max(0, timeLeft) / timerTotal)),
                  style: { transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }
                })
              ),
              React.createElement("div", { className: "arc-timer-num" + (timerUrgent ? " urgent" : timerWarn ? " warn" : "") }, timeLeft),
              React.createElement("div", { className: "arc-timer-lbl" }, "seconds")
            ),

            React.createElement("div", { className: "lifeline-bar" },
              React.createElement("div", { className: "ll-item" + (lifelines.fifty && selected === null ? "" : " used"), onClick: use5050 },
                React.createElement("span", { className: "ll-icon" }, "50:50"),
                React.createElement("span", { className: "ll-label" }, "50:50")
              ),
              React.createElement("div", { className: "ll-item" + (lifelines.audience && selected === null ? "" : " used"), onClick: useAudience },
                React.createElement("span", { className: "ll-icon" }, "👥"),
                React.createElement("span", { className: "ll-label" }, "Audience")
              ),
              React.createElement("div", { className: "ll-item" + (lifelines.expert && selected === null && !expertLoad ? "" : " used"), onClick: useExpert },
                React.createElement("span", { className: "ll-icon" }, "🎓"),
                React.createElement("span", { className: "ll-label" }, "Expert")
              ),
              React.createElement("div", { className: "ll-item" + (lifelines.double ? ((revealed && selected !== null && q && selected !== q.correct) || (!revealed && selected === null) ? "" : " used") : " used"), onClick: useDouble },
                React.createElement("span", { className: "ll-icon" }, "2x"),
                React.createElement("span", { className: "ll-label" }, "Double")
              ),
              React.createElement("div", { className: "ll-sep" }),
              React.createElement("div", { className: "ll-winnings" },
                React.createElement("div", { className: "ll-win-val" }, "Rs." + winnings),
                React.createElement("div", { className: "ll-win-lbl" }, "Winnings")
              ),
              React.createElement("div", { className: "ll-quit", onClick: function() { stopTimer(); setShowQuit(true); } }, "QUIT")
            ),

            // Double Chance banner
            (doubleActive || firstWrongIdx !== null) && !revealed && React.createElement("div", { className: "dc-banner" },
              React.createElement("span", { className: "dc-dot" }),
              doubleActive && firstWrongIdx === null
                ? "Double Chance Active - You get 2 tries!"
                : "Second Chance! Pick a DIFFERENT answer!"
            ),

            // Hindi indicator
            isHindi && hindiData && !loadingQ && React.createElement("div", { className: "hindi-ind" },
              React.createElement("span", { className: "h-dot" }),
              "Showing in Hindi"
            ),

            // Audience poll
            showPoll && poll && React.createElement("div", { className: "ll-panel" },
              React.createElement("div", { className: "panel-title" }, "Audience Poll"),
              poll.map(function(pct, i) {
                if (filtered && filtered[i] === null) return null;
                return React.createElement("div", { key: i, className: "poll-row" },
                  React.createElement("span", { className: "poll-lbl" }, LABELS[i]),
                  React.createElement("div", { className: "poll-bg" },
                    React.createElement("div", { className: "poll-fill", style: { width: pct + "%" } }, pct > 12 ? pct + "%" : "")
                  ),
                  React.createElement("span", { className: "poll-pct" }, pct + "%")
                );
              })
            ),

            // Expert opinion
            showExpert && React.createElement("div", { className: "ll-panel" },
              React.createElement("div", { className: "panel-title" }, "Expert Opinion"),
              expertLoad
                ? React.createElement("div", { className: "load-sub" }, "Expert is thinking...")
                : React.createElement("div", { className: "expert-txt" }, expertTxt)
            ),

            // QUESTION BOX
            loadingQ
              ? React.createElement("div", { className: "q-box" },
                  React.createElement("div", { className: "q-text", style: { opacity: 0.4 } }, "Generating question...")
                )
              : dq && React.createElement("div", { className: "q-box", key: currentQ },
                  React.createElement("div", { className: "q-meta" },
                    React.createElement("span", { className: "q-num" }, "Question " + (currentQ + 1) + " of 17"),
                    dq.topic && React.createElement("span", { className: "q-topic" }, dq.topic),
                    React.createElement("span", { className: "q-prize-tag" }, "Rs." + PRIZE_LADDER[currentQ].prize)
                  ),
                  React.createElement("div", { className: "q-text" }, dq.question)
                ),

            // OPTIONS
            dq && !loadingQ && React.createElement("div", { className: "opts" },
              dq.options.map(function(opt, idx) {
                var capturedIdx = idx;
                var isDisabled = revealed || (timeLeft === 0) || (firstWrongIdx !== null && capturedIdx === firstWrongIdx);
                return React.createElement("button", {
                  key: capturedIdx,
                  className: optCls(capturedIdx),
                  onClick: function() { handleSelect(capturedIdx); },
                  disabled: isDisabled
                },
                  React.createElement("span", { className: "opt-lbl" }, LABELS[capturedIdx]),
                  (filtered ? filtered[capturedIdx] : opt) || ""
                );
              })
            ),

            // FULL EXPLANATION after answer
            revealed && dq && React.createElement("div", { className: "expl-full" },
              React.createElement("div", { className: "expl-header" + (selected === q.correct ? " correct" : " wrong") },
                selected === q.correct
                  ? React.createElement("span", null, "Correct! The answer is ", React.createElement("strong", null, LABELS[q.correct] + ") " + dq.options[q.correct]))
                  : React.createElement("span", null, "Wrong! The correct answer is ", React.createElement("strong", null, LABELS[q.correct] + ") " + dq.options[q.correct]))
              ),
              dq.explanation && React.createElement("div", { className: "expl-body" }, dq.explanation)
            ),

            // ACTIONS after reveal
            revealed && !loadingQ && (
              selected === q.correct
                ? React.createElement("div", { className: "auto-adv" },
                    React.createElement("div", { className: "aa-bar" }),
                    React.createElement("span", { className: "aa-txt" }, currentQ < 15 ? "Correct! Loading next question..." : "You won Rs.7 CRORE! You are a Genius!")
                  )
                : React.createElement("button", { className: "btn-see-result", onClick: function() { setScreen("gameover"); } }, "See Results")
            )
          ),

          React.createElement(PrizePanel)
        ),

        // QUIT MODAL
        showQuit && React.createElement("div", { className: "overlay" },
          React.createElement("div", { className: "modal" },
            React.createElement("div", { className: "modal-emoji" }, "🚪"),
            React.createElement("div", { className: "modal-title" }, "Quit Game?"),
            React.createElement("p", { className: "modal-sub" }, "You will take home your safe amount only."),
            lastPrize && React.createElement("div", { className: "modal-last" },
              React.createElement("div", { className: "ml-lbl" }, "Last Correct Answer"),
              React.createElement("div", { className: "ml-prize" }, "Rs." + lastPrize)
            ),
            React.createElement("div", { style: { fontSize: "0.58rem", color: "var(--dim)", fontFamily: "'Exo 2',sans-serif", letterSpacing: "2px", textTransform: "uppercase" } }, "Safe Amount"),
            React.createElement("div", { className: "modal-safe" }, "Rs." + safeWin),
            safeWin === "0" && React.createElement("p", { style: { fontSize: "0.66rem", color: "var(--red)", margin: "6px 0 10px" } }, "No checkpoint reached yet - you leave with Rs.0"),
            React.createElement("div", { className: "modal-btns" },
              React.createElement("button", { className: "btn-c", onClick: function() {
                setShowQuit(false);
                var secs = getTimer(currentQ);
                if (secs !== null && timeLeft !== null && timeLeft > 0) setTimerOn(true);
              } }, "Continue"),
              React.createElement("button", { className: "btn-q", onClick: function() {
                setShowQuit(false);
                setWinnings(safeWin);
                setScreen("result");
              } }, "Quit & Take Money")
            )
          )
        ),

        // RESULT
        screen === "result" && React.createElement("div", null,
          React.createElement(ConfettiRain),
          React.createElement("div", { className: "end-screen" },
            React.createElement("div", { className: "end-card" },
              React.createElement("div", { className: "ec-emoji" }, "🏆"),
              React.createElement("div", { className: "ec-title" }, "Congratulations!"),
              React.createElement("div", { style: { color: "var(--dim)", fontSize: "0.72rem", fontFamily: "'Exo 2',sans-serif", letterSpacing: "2px", textTransform: "uppercase" } }, "You Take Home"),
              React.createElement("div", { className: "ec-prize" }, "Rs." + winnings),
              lastPrize && winnings !== lastPrize && React.createElement("div", { className: "ec-last" },
                React.createElement("div", { className: "ml-lbl" }, "Last Correct Answer"),
                React.createElement("div", { className: "ml-prize" }, "Rs." + lastPrize)
              ),
              React.createElement("p", { className: "ec-sub" }, winnings === "7,00,00,000" ? "All 17 questions correct! You are the ultimate Genius!" : "Outstanding! Keep pushing for that Rs.7 Crore!"),
              React.createElement("button", { className: "btn-again", onClick: function() { setScreen("rules"); } }, "Play Again")
            )
          )
        ),

        // GAME OVER
        screen === "gameover" && React.createElement("div", { className: "end-screen" },
          React.createElement("div", { className: "end-card" },
            React.createElement("div", { className: "ec-emoji" }, selected === -1 ? "⏰" : "😔"),
            React.createElement("div", { className: "ec-title", style: { color: selected === -1 ? "orange" : "var(--red)" } }, selected === -1 ? "Time Up!" : "Wrong Answer!"),
            React.createElement("div", { style: { color: "var(--dim)", fontSize: "0.72rem", fontFamily: "'Exo 2',sans-serif", letterSpacing: "2px", textTransform: "uppercase" } }, "You Take Home"),
            React.createElement("div", { className: "ec-prize", style: { color: "var(--gold)" } }, "Rs." + safeWin),
            lastPrize && React.createElement("div", { className: "ec-last" },
              React.createElement("div", { className: "ml-lbl" }, "Last Correct Answer"),
              React.createElement("div", { className: "ml-prize" }, "Rs." + lastPrize)
            ),
            q && React.createElement("div", { className: "ec-ans" },
              "Correct Answer: " + LABELS[q.correct] + ") " + q.options[q.correct] + (q.explanation ? " - " + q.explanation : "")
            ),
            React.createElement("p", { className: "ec-sub" }, (selected === -1 ? "The clock ran out! " : "Better luck next time! ") + "You reached Q" + (currentQ + 1) + " of 17."),
            React.createElement("button", { className: "btn-again", onClick: function() { setScreen("rules"); } }, "Try Again")
          )
        )

      )
    )
  );
}
