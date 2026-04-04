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
  {question:"Who is known as the Father of the Nation of India?",options:["Jawaharlal Nehru","Sardar Patel","Mahatma Gandhi","B.R. Ambedkar"],correct:2,topic:"Indian History",explanation:"Mahatma Gandhi is called the Father of the Nation for leading India's independence movement through non-violence."},
  {question:"Which is the largest planet in our Solar System?",options:["Saturn","Neptune","Uranus","Jupiter"],correct:3,topic:"Space",explanation:"Jupiter is the largest planet, with a mass greater than all other planets combined."},
  {question:"What does HTML stand for?",options:["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Meta Language","Home Tool Markup Language"],correct:0,topic:"Computer Science",explanation:"HTML stands for Hyper Text Markup Language, the standard language for creating web pages."},
  {question:"Which organ pumps blood throughout the human body?",options:["Liver","Lungs","Kidney","Heart"],correct:3,topic:"Human Body",explanation:"The heart is the muscular organ that pumps blood through the circulatory system."},
  {question:"What is 15% of 200?",options:["20","25","30","35"],correct:2,topic:"Mathematics",explanation:"15% of 200 = (15/100) x 200 = 30."},
  {question:"Which country won the FIFA World Cup 2022?",options:["Brazil","France","Argentina","Germany"],correct:2,topic:"Football",explanation:"Argentina won the FIFA World Cup 2022 in Qatar, defeating France in the final."},
  {question:"What is the full form of WHO?",options:["World Health Organization","World Humanitarian Organization","World Heritage Organization","World Housing Organization"],correct:0,topic:"World Organizations",explanation:"WHO stands for World Health Organization, a specialized agency of the United Nations."},
  {question:"In which year was the first iPhone released?",options:["2005","2006","2007","2008"],correct:2,topic:"Technology",explanation:"Apple released the first iPhone on June 29, 2007."},
  {question:"Who wrote the play Romeo and Juliet?",options:["Charles Dickens","William Shakespeare","Jane Austen","Mark Twain"],correct:1,topic:"Literature",explanation:"Romeo and Juliet was written by William Shakespeare around 1594-1596."},
  {question:"What is the chemical formula of common salt?",options:["KCl","NaCl","MgCl2","CaCl2"],correct:1,topic:"Chemistry",explanation:"Common salt is sodium chloride with the chemical formula NaCl."},
  {question:"How many events are there in a Decathlon?",options:["8","9","10","12"],correct:2,topic:"Olympics",explanation:"A decathlon consists of 10 track and field events spread over two days."},
  {question:"Which Indian city is known as the Silicon Valley of India?",options:["Mumbai","Hyderabad","Chennai","Bengaluru"],correct:3,topic:"India",explanation:"Bengaluru (Bangalore) is called the Silicon Valley of India due to its IT industry dominance."},
  {question:"What is the value of Pi (to 2 decimal places)?",options:["3.12","3.14","3.16","3.18"],correct:1,topic:"Mathematics",explanation:"Pi is approximately 3.14159... commonly rounded to 3.14."},
  {question:"Which is the largest ocean on Earth?",options:["Atlantic Ocean","Indian Ocean","Arctic Ocean","Pacific Ocean"],correct:3,topic:"Geography",explanation:"The Pacific Ocean is the largest and deepest ocean covering about 30% of Earth's surface."},
  {question:"Who was the first woman Prime Minister of India?",options:["Pratibha Patil","Sonia Gandhi","Indira Gandhi","Sarojini Naidu"],correct:2,topic:"Indian History",explanation:"Indira Gandhi served as India's first and only female Prime Minister from 1966 to 1984."},
  {question:"What does RAM stand for in computers?",options:["Read Access Memory","Random Access Memory","Rapid Action Memory","Read All Memory"],correct:1,topic:"Computer Science",explanation:"RAM stands for Random Access Memory, the temporary storage used by computers."},
  {question:"Which gas is most abundant in Earth's atmosphere?",options:["Oxygen","Carbon Dioxide","Argon","Nitrogen"],correct:3,topic:"Science",explanation:"Nitrogen makes up about 78% of Earth's atmosphere."},
  {question:"How many gold medals did India win in the 2020 Tokyo Olympics?",options:["0","1","2","3"],correct:1,topic:"Olympics",explanation:"India won 1 gold medal at the Tokyo 2020 Olympics, won by Neeraj Chopra in javelin throw."},
  {question:"What is the largest desert in the world?",options:["Sahara Desert","Gobi Desert","Arabian Desert","Antarctic Desert"],correct:3,topic:"Geography",explanation:"The Antarctic Desert is the world's largest desert at about 14.2 million sq km."},
  {question:"Who is the author of the Harry Potter series?",options:["Stephenie Meyer","J.R.R. Tolkien","J.K. Rowling","C.S. Lewis"],correct:2,topic:"Literature",explanation:"J.K. Rowling wrote the Harry Potter series, one of the best-selling book series of all time."},
  {question:"What is the basic unit of life?",options:["Atom","Cell","Molecule","Tissue"],correct:1,topic:"Biology",explanation:"The cell is the basic structural and functional unit of all living organisms."},
  {question:"Which Article of the Indian Constitution gives the Right to Equality?",options:["Article 12","Article 14","Article 19","Article 21"],correct:1,topic:"Constitution of India",explanation:"Article 14 guarantees equality before law and equal protection of laws to all persons in India."},
  {question:"What is the capital of Australia?",options:["Sydney","Melbourne","Brisbane","Canberra"],correct:3,topic:"World GK",explanation:"Canberra is the capital of Australia, not Sydney which is the largest city."},
  {question:"In cricket, how many runs is a No Ball penalized as?",options:["0","1","2","5"],correct:1,topic:"Cricket",explanation:"A no ball results in 1 extra run being added to the batting team's score."},
  {question:"What is the speed of light approximately?",options:["2 lakh km/s","3 lakh km/s","4 lakh km/s","5 lakh km/s"],correct:1,topic:"Physics",explanation:"The speed of light in vacuum is approximately 3 x 10^8 m/s or 3 lakh km per second."},
  {question:"Which sport is played at Wimbledon?",options:["Cricket","Badminton","Tennis","Squash"],correct:2,topic:"Sports",explanation:"Wimbledon is the oldest Grand Slam tennis tournament held in London, England."},
  {question:"What does GDP stand for?",options:["Gross Domestic Product","General Domestic Production","Global Development Product","Gross Demand Percentage"],correct:0,topic:"Economics",explanation:"GDP stands for Gross Domestic Product, the total monetary value of goods and services produced in a country."},
  {question:"Which vitamin is known as the sunshine vitamin?",options:["Vitamin A","Vitamin B12","Vitamin C","Vitamin D"],correct:3,topic:"Human Body",explanation:"Vitamin D is called the sunshine vitamin because the skin synthesizes it when exposed to sunlight."},
  {question:"Who invented the telephone?",options:["Thomas Edison","Nikola Tesla","Alexander Graham Bell","Guglielmo Marconi"],correct:2,topic:"Science",explanation:"Alexander Graham Bell is credited with patenting the first practical telephone in 1876."},
  {question:"What is the currency of the United Kingdom?",options:["Euro","Dollar","Pound Sterling","Franc"],correct:2,topic:"World GK",explanation:"The Pound Sterling (GBP) is the official currency of the United Kingdom."},
];

var MEDIUM_QS = [
  {question:"Which Article of the Indian Constitution deals with the Right to Life and Personal Liberty?",options:["Article 14","Article 17","Article 19","Article 21"],correct:3,topic:"Constitution of India",explanation:"Article 21 states that no person shall be deprived of life or personal liberty except by procedure established by law."},
  {question:"What is the term for buying goods at a lower price and selling at a higher price?",options:["Speculation","Arbitrage","Hedging","Leverage"],correct:1,topic:"Business",explanation:"Arbitrage is the practice of taking advantage of price differences in different markets to earn a profit."},
  {question:"Who was the first Indian to win a Nobel Prize?",options:["C.V. Raman","Amartya Sen","Rabindranath Tagore","Mother Teresa"],correct:2,topic:"Indian History",explanation:"Rabindranath Tagore won the Nobel Prize in Literature in 1913 for his collection Gitanjali."},
  {question:"What is the P/E ratio in stock market analysis?",options:["Profit to Equity ratio","Price to Earnings ratio","Productivity to Expenditure ratio","Premium to Expense ratio"],correct:1,topic:"Economics",explanation:"P/E ratio (Price to Earnings) measures a company's share price relative to its earnings per share."},
  {question:"Which planet has the Great Red Spot?",options:["Mars","Saturn","Jupiter","Neptune"],correct:2,topic:"Space",explanation:"Jupiter's Great Red Spot is a giant storm that has persisted for at least 350 years."},
  {question:"What is the Doctrine of Separation of Powers?",options:["Division of land among states","Division of government into legislature, executive and judiciary","Division of military power","Division of tax collection"],correct:1,topic:"Constitution of India",explanation:"The Doctrine of Separation of Powers divides government into three independent branches: legislature, executive and judiciary."},
  {question:"Who directed the Bollywood film 'Mughal-E-Azam'?",options:["Raj Kapoor","Guru Dutt","K. Asif","Mehboob Khan"],correct:2,topic:"Bollywood",explanation:"Mughal-E-Azam (1960) was directed by K. Asif and remains one of the greatest Indian films ever made."},
  {question:"What is the formula for calculating profit percentage?",options:["(Profit/CP) x 100","(Profit/SP) x 100","(CP/SP) x 100","(SP-CP) x 100"],correct:0,topic:"Profit and Loss",explanation:"Profit Percentage = (Profit / Cost Price) x 100, where Profit = Selling Price - Cost Price."},
  {question:"Which country hosted the first modern Olympic Games?",options:["France","UK","USA","Greece"],correct:3,topic:"Olympics",explanation:"The first modern Olympic Games were held in Athens, Greece in 1896."},
  {question:"What is the process by which plants make food using sunlight called?",options:["Respiration","Transpiration","Photosynthesis","Fermentation"],correct:2,topic:"Biology",explanation:"Photosynthesis is the process by which plants use sunlight, water and CO2 to produce glucose and oxygen."},
  {question:"Which Indian law governs companies in India?",options:["Companies Act 1956","Companies Act 2013","SEBI Act 1992","FEMA 1999"],correct:1,topic:"Business",explanation:"The Companies Act 2013 is the primary legislation governing companies and corporate affairs in India."},
  {question:"Who won the Nobel Peace Prize in 2014 along with Malala Yousafzai?",options:["Amartya Sen","Kailash Satyarthi","Narendra Modi","A.P.J. Abdul Kalam"],correct:1,topic:"Current Affairs",explanation:"Kailash Satyarthi, Indian child rights activist, won the Nobel Peace Prize 2014 jointly with Malala Yousafzai."},
  {question:"What is the psychological term for fear of open spaces?",options:["Claustrophobia","Agoraphobia","Acrophobia","Xenophobia"],correct:1,topic:"Psychology",explanation:"Agoraphobia is an anxiety disorder characterized by fear of open or crowded spaces from which escape might be difficult."},
  {question:"In the 1965 Indo-Pakistan War, which Indian general was known as the 'Sparrow'?",options:["Sam Manekshaw","Arjan Singh","Harbakhsh Singh","Raghu Raj"],correct:0,topic:"Wars",explanation:"General Sam Manekshaw was known as 'Sam Bahadur' but it was General Harbakhsh Singh who commanded in 1965; Air Marshal Arjan Singh led the IAF."},
  {question:"What is the largest gland in the human body?",options:["Pancreas","Thyroid","Liver","Spleen"],correct:2,topic:"Human Body",explanation:"The liver is the largest internal gland, weighing about 1.5 kg and performing over 500 functions."},
  {question:"Which Hollywood film won the Oscar for Best Picture in 2020?",options:["1917","Joker","Once Upon a Time in Hollywood","Parasite"],correct:3,topic:"Hollywood",explanation:"Parasite (South Korean film) won the Academy Award for Best Picture at the 2020 Oscars, a historic first for a non-English film."},
  {question:"What does the term 'Bull Market' mean in stock markets?",options:["Market falling steadily","Market rising steadily","Market with high volatility","Market with foreign investment"],correct:1,topic:"Economics",explanation:"A bull market refers to a financial market experiencing sustained price increases and investor confidence."},
  {question:"Who was the first Paralympic gold medalist from India?",options:["Mariyappan Thangavelu","Devendra Jhajharia","Murlikant Petkar","Deepa Malik"],correct:2,topic:"Para Olympics",explanation:"Murlikant Petkar won India's first Paralympic gold medal in swimming (50m freestyle) at the 1972 Heidelberg Paralympics."},
  {question:"What is the Keynesian Theory in economics?",options:["Free markets self-regulate","Government spending drives economic growth","Trade deficits strengthen economies","Inflation is always beneficial"],correct:1,topic:"Economics",explanation:"Keynesian economics argues that government fiscal policy and spending can stimulate economic demand and growth, especially in recessions."},
  {question:"Which Indian space mission discovered water on the Moon?",options:["Chandrayaan-1","Chandrayaan-2","Mangalyaan","ASTROSAT"],correct:0,topic:"Space",explanation:"Chandrayaan-1 (2008) discovered water molecules on the Moon's surface using its Moon Impact Probe."},
  {question:"What is the Gross Profit formula?",options:["Net Sales - COGS","Net Sales + COGS","Net Sales x COGS","Net Sales / COGS"],correct:0,topic:"Profit and Loss",explanation:"Gross Profit = Net Sales minus Cost of Goods Sold (COGS). It shows profit before operating expenses."},
  {question:"Which Indian author wrote 'The God of Small Things'?",options:["Vikram Seth","Salman Rushdie","Arundhati Roy","Amitav Ghosh"],correct:2,topic:"Literature",explanation:"Arundhati Roy won the Booker Prize in 1997 for 'The God of Small Things'."},
  {question:"What is Cognitive Dissonance in psychology?",options:["Memory loss disorder","Mental discomfort from conflicting beliefs","Fear of public speaking","Inability to focus"],correct:1,topic:"Psychology",explanation:"Cognitive dissonance is the mental discomfort experienced when holding two or more contradictory beliefs simultaneously."},
  {question:"Which Article of the Indian Constitution abolished untouchability?",options:["Article 14","Article 15","Article 17","Article 19"],correct:2,topic:"Constitution of India",explanation:"Article 17 of the Indian Constitution abolishes untouchability and makes its practice a punishable offence."},
  {question:"What does 'ROI' stand for in business?",options:["Rate of Investment","Return on Investment","Revenue of Income","Rate of Inflation"],correct:1,topic:"Business",explanation:"ROI (Return on Investment) measures the gain or loss generated relative to the amount of money invested."},
  {question:"Who developed the theory of evolution by natural selection?",options:["Gregor Mendel","Louis Pasteur","Charles Darwin","Isaac Newton"],correct:2,topic:"Science",explanation:"Charles Darwin proposed the theory of evolution by natural selection in his 1859 work 'On the Origin of Species'."},
  {question:"What is the Preamble to the Indian Constitution?",options:["Introduction to Parliament","Introductory statement declaring the source, goals and nature of the Constitution","List of Fundamental Rights","List of Directive Principles"],correct:1,topic:"Constitution of India",explanation:"The Preamble is the introductory statement of the Indian Constitution declaring it a Sovereign, Socialist, Secular, Democratic Republic."},
  {question:"Who won the Bharat Ratna in 2024?",options:["Lata Mangeshkar","Karpoori Thakur","Narendra Modi","Sachin Tendulkar"],correct:1,topic:"Current Affairs",explanation:"Karpoori Thakur, former Bihar CM, was posthumously awarded the Bharat Ratna in 2024."},
  {question:"What is the half-life of Carbon-14 used in radiocarbon dating?",options:["1,730 years","5,730 years","17,300 years","57,300 years"],correct:1,topic:"Chemistry",explanation:"Carbon-14 has a half-life of approximately 5,730 years, making it useful for dating organic materials up to about 50,000 years old."},
  {question:"Which country has the largest proven oil reserves?",options:["Saudi Arabia","Russia","UAE","Venezuela"],correct:3,topic:"World GK",explanation:"Venezuela has the world's largest proven oil reserves at about 303 billion barrels according to OPEC data."},
];

var HARD_QS = [
  {question:"What is the Dworkinian concept of 'Rights as Trumps' in legal theory?",options:["Rights can be overridden by majority preference","Rights override collective goals and policy justifications","Rights are created by governments","Rights are absolute and unlimited"],correct:1,topic:"Law",explanation:"Ronald Dworkin argued that rights 'trump' ordinary policy considerations - even when overriding rights is collectively beneficial, it remains wrong."},
  {question:"What is the Mundell-Fleming Model?",options:["Model of international trade barriers","Open economy macroeconomics model linking exchange rates, interest rates and output","Model of domestic inflation","Model of corporate taxation"],correct:1,topic:"Economics",explanation:"The Mundell-Fleming model extends IS-LM to open economies, showing the effectiveness of monetary and fiscal policies under different exchange rate regimes."},
  {question:"Which Article of the Indian Constitution deals with the procedure for Constitutional Amendments?",options:["Article 356","Article 368","Article 370","Article 371"],correct:1,topic:"Constitution of India",explanation:"Article 368 lays down the procedure for amending the Indian Constitution, distinguishing between simple majority, special majority and ratification requirements."},
  {question:"What is the Chandrasekhar Limit in astrophysics?",options:["1.0 solar masses","1.4 solar masses","1.8 solar masses","2.0 solar masses"],correct:1,topic:"Space",explanation:"The Chandrasekhar Limit (1.4 solar masses) is the maximum mass of a stable white dwarf star - beyond this, the star collapses into a neutron star or black hole."},
  {question:"What is the Riemann Hypothesis in mathematics?",options:["All prime numbers are odd","Non-trivial zeros of the Riemann zeta function lie on the critical line Re(s)=1/2","Every even integer is the sum of two primes","There are infinitely many twin primes"],correct:1,topic:"Mathematics",explanation:"The Riemann Hypothesis conjectures that all non-trivial zeros of the zeta function have real part 1/2. It remains one of the greatest unsolved problems in mathematics."},
  {question:"Who propounded the Two-Nation Theory that led to the Partition of India?",options:["Mohammad Ali Jinnah","Allama Iqbal","Sir Syed Ahmed Khan","Liaquat Ali Khan"],correct:1,topic:"Indian History",explanation:"Sir Allama Iqbal first proposed the concept of a separate Muslim state in his 1930 Allahabad Address; Jinnah later championed the Two-Nation Theory politically."},
  {question:"What is Planck's Constant approximately equal to?",options:["6.626 x 10^-34 Js","6.626 x 10^-24 Js","6.626 x 10^34 Js","3.14 x 10^-34 Js"],correct:0,topic:"Physics",explanation:"Planck's constant h = 6.626 x 10^-34 joule-seconds, fundamental to quantum mechanics relating energy and frequency of photons."},
  {question:"Which landmark Indian Supreme Court case established the Basic Structure Doctrine?",options:["Golaknath v State of Punjab","Kesavananda Bharati v State of Kerala","Maneka Gandhi v Union of India","Minerva Mills v Union of India"],correct:1,topic:"Law",explanation:"Kesavananda Bharati v State of Kerala (1973) established that Parliament cannot amend the 'basic structure' of the Constitution even with a special majority."},
  {question:"What is the Krebs Cycle in biochemistry?",options:["Process of DNA replication","Series of chemical reactions used by cells to generate energy from acetyl-CoA","Process of protein synthesis","Mechanism of neural signal transmission"],correct:1,topic:"Biology",explanation:"The Krebs Cycle (citric acid cycle) is a series of reactions in mitochondria that oxidizes acetyl-CoA to CO2 generating NADH and FADH2 for ATP production."},
  {question:"What was the significance of the Battle of Plassey in 1757?",options:["Ended Mughal Empire","Established British supremacy in Bengal beginning colonial rule","Defeated the Marathas","Ended French influence in India"],correct:1,topic:"Wars",explanation:"The Battle of Plassey (23 June 1757) saw Robert Clive defeat Siraj-ud-Daulah, establishing British East India Company's control over Bengal and beginning colonial rule."},
  {question:"What is the Drake Equation used for?",options:["Calculating gravitational forces","Estimating the number of active communicating extraterrestrial civilizations","Measuring dark matter","Calculating stellar distances"],correct:1,topic:"Space",explanation:"Frank Drake's equation (1961) estimates the number of technologically advanced civilizations in the Milky Way capable of communicating with Earth."},
  {question:"What is the Sapir-Whorf Hypothesis in linguistics?",options:["All languages evolve from one origin","Language shapes thought and perception of reality","Grammar is universal across languages","Writing precedes speech in human evolution"],correct:1,topic:"Psychology",explanation:"The Sapir-Whorf (linguistic relativity) hypothesis proposes that the language we speak influences or determines how we perceive and think about the world."},
  {question:"In which year did India conduct its first nuclear test called 'Smiling Buddha'?",options:["1968","1972","1974","1978"],correct:2,topic:"Current Affairs",explanation:"India's first nuclear test 'Smiling Buddha' (Operation Pokhran-I) was conducted on 18 May 1974 in Rajasthan's Pokhran site."},
  {question:"What is the Fisher Effect in economics?",options:["Exchange rates adjust to purchasing power parity","Nominal interest rates adjust to expected inflation preserving real rates","Trade deficits self-correct over time","Inflation always follows money supply growth"],correct:1,topic:"Economics",explanation:"The Fisher Effect states that nominal interest rates rise point-for-point with expected inflation, keeping real interest rates constant in the long run."},
  {question:"Who discovered the Neutron and in which year?",options:["Ernest Rutherford in 1911","Niels Bohr in 1913","James Chadwick in 1932","Paul Dirac in 1928"],correct:2,topic:"Physics",explanation:"James Chadwick discovered the neutron in 1932 through experiments bombarding beryllium with alpha particles, earning him the 1935 Nobel Prize in Physics."},
  {question:"What is the Doctrine of Promissory Estoppel in Indian contract law?",options:["A contract must be in writing","A party cannot go back on a promise when the other relied on it to their detriment","Contracts with minors are void","Consideration must be adequate"],correct:1,topic:"Law",explanation:"Promissory Estoppel prevents a party from reneging on a clear and unambiguous promise when the promisee has relied on it to their detriment, even without formal consideration."},
  {question:"What does CRISPR-Cas9 technology enable in genetic research?",options:["Cloning entire organisms","Precise editing of DNA sequences by cutting and modifying specific genes","Sequencing entire genomes rapidly","Creating synthetic proteins"],correct:1,topic:"Biology",explanation:"CRISPR-Cas9 is a revolutionary gene-editing tool that allows scientists to precisely cut, add or alter sections of DNA, transforming medicine, agriculture and research."},
  {question:"Who was awarded the Bharat Ratna posthumously in 1999 for contributions to music?",options:["Lata Mangeshkar","Ravi Shankar","M.S. Subbulakshmi","Bismillah Khan"],correct:2,topic:"Current Affairs",explanation:"M.S. Subbulakshmi (M.S. Subbalakshmi), the Carnatic vocalist, was the first musician to receive the Bharat Ratna in 1998 (not 1999)."},
  {question:"What is the Nash Equilibrium in Game Theory?",options:["The outcome where all players win","Stable state where no player benefits by changing strategy unilaterally","The outcome with maximum collective benefit","The strategy chosen by the dominant player"],correct:1,topic:"Mathematics",explanation:"Nash Equilibrium is a state in a game where no player can improve their outcome by unilaterally changing their strategy, given others' strategies remain the same."},
  {question:"Which Indian General led the 1971 Indo-Pakistan War and was later elevated to Field Marshal?",options:["Arjan Singh","K.M. Cariappa","Sam Manekshaw","Harbakhsh Singh"],correct:2,topic:"Wars",explanation:"General Sam Manekshaw commanded the Indian Armed Forces in the 1971 war leading to Bangladesh's liberation, and was later elevated to the rank of Field Marshal in 1973."},
  {question:"What is the Photoelectric Effect and who explained it?",options:["Diffraction of light by particles - explained by Maxwell","Emission of electrons when light hits a metal surface - explained by Einstein","Bending of light around corners - explained by Huygens","Polarization of light - explained by Malus"],correct:1,topic:"Physics",explanation:"The Photoelectric Effect is the emission of electrons when light strikes a metal surface. Einstein explained it in 1905 using photon theory, winning the 1921 Nobel Prize."},
  {question:"What is the Permanent Account Number (PAN) used for in India?",options:["Identity proof for voting","Unique identifier for tax purposes tracking financial transactions","Passport application","Driving license verification"],correct:1,topic:"Business",explanation:"PAN is a 10-character alphanumeric code issued by the Income Tax Department to track all financial transactions for tax assessment purposes."},
  {question:"What is the Higgs Boson and why was its discovery significant?",options:["Particle carrying electromagnetic force","Fundamental particle that gives other particles their mass, completing the Standard Model","Anti-matter particle","Dark matter particle"],correct:1,topic:"Physics",explanation:"The Higgs Boson, discovered at CERN in 2012, is the particle associated with the Higgs field that gives fundamental particles their mass, completing the Standard Model of particle physics."},
  {question:"Which case established that the Right to Privacy is a Fundamental Right in India?",options:["Kesavananda Bharati case","Maneka Gandhi case","Justice K.S. Puttaswamy case","Minerva Mills case"],correct:2,topic:"Law",explanation:"In Justice K.S. Puttaswamy v Union of India (2017), a 9-judge Supreme Court bench unanimously held that the Right to Privacy is a fundamental right under Article 21."},
  {question:"What is the concept of 'Comparative Advantage' in international trade?",options:["Countries should only export what they produce best absolutely","Countries benefit by specializing in goods with lower opportunity costs relative to trading partners","Free trade always benefits all nations equally","Trade deficits always harm economies"],correct:1,topic:"Economics",explanation:"David Ricardo's Comparative Advantage shows nations gain from trade by specializing where their opportunity cost is relatively lower, even if another country is more efficient at everything."},
  {question:"What was Operation Shakti (Pokhran-II) and when did it occur?",options:["Satellite launch in 1999","Series of five nuclear tests in May 1998","Naval exercise in 2000","Surgical strikes in 2016"],correct:1,topic:"Current Affairs",explanation:"Operation Shakti (Pokhran-II) was a series of five nuclear bomb tests conducted by India on 11-13 May 1998 in Rajasthan, making India a declared nuclear state."},
  {question:"What is the Dunning-Kruger Effect in cognitive psychology?",options:["Intelligence increases with age","People with limited knowledge overestimate their competence","Experts always underestimate task difficulty","Memory improves under stress"],correct:1,topic:"Psychology",explanation:"The Dunning-Kruger Effect is a cognitive bias where people with limited knowledge in a domain overestimate their own competence, while genuine experts tend to underestimate theirs."},
  {question:"What is the Wien's Displacement Law in physics?",options:["Wavelength of sound changes with temperature","Peak wavelength of blackbody radiation is inversely proportional to its temperature","Light speed varies with medium density","Electrical resistance increases linearly with temperature"],correct:1,topic:"Physics",explanation:"Wien's Displacement Law states that the peak wavelength of radiation emitted by a black body is inversely proportional to its absolute temperature (wavelength x temperature = 2.898 x 10^-3 mK)."},
  {question:"Which international organization was established by the Bretton Woods Agreement in 1944?",options:["United Nations","NATO","IMF and World Bank","WTO"],correct:2,topic:"World Organizations",explanation:"The Bretton Woods Conference (1944) established the International Monetary Fund (IMF) and International Bank for Reconstruction and Development (World Bank) to stabilize global economy post WWII."},
  {question:"What is the concept of 'Bounded Rationality' proposed by Herbert Simon?",options:["Humans make perfectly rational decisions","Decision-making is limited by cognitive capacity, time and available information","Markets are always rational","Rational actors never make mistakes"],correct:1,topic:"Psychology",explanation:"Herbert Simon's Bounded Rationality concept argues that human decision-making is constrained by limited information, cognitive limitations and time - leading to satisficing rather than optimizing."},
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
  return pickQuestion(pool, _sessionUsed[key], _persistUsed[key], key);
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
    // Indian Culture & Society
    "Famous Indian sweets and their states of origin",
    "Important Hindu temples and their locations in India",
    "Indian festivals and their significance",
    "Indian freedom struggle key dates and figures",
    "Famous Indian authors and their novels",
    // Fill in the Blanks
    "Fill in the blank - famous Bollywood song lyrics",
    "Fill in the blank - famous Hindi movie dialogues",
    "Fill in the blank - famous Indian quotes and proverbs",
    "Fill in the blank - famous English song lyrics",
    // GK
    "Indian GK - states capitals and languages",
    "World Geography capitals rivers and mountains",
    "Current Indian government policies and schemes 2024",
    "Basic Mathematics - percentages fractions decimals",
    "Basic Science - physics chemistry biology",
    "Human Body organs and functions",
    "Olympics and sports basic facts",
    "Constitution of India basics Preamble and rights",
    "Technology and Computer Science basics",
    "Space exploration and solar system",
    "Animal kingdom and biodiversity",
    "World capitals currencies and flags",
    "Nobel Prize winners and their fields",
    "Indian economy GDP and basic finance",
    "United Nations and world organisations",
    "Basic Coding - programming languages and concepts",
    "Cricket records and tournaments",
    "Bollywood films directors and actors",
    "Hollywood films and awards",
    "Famous inventors and their inventions",
    "Indian temples - Tirupati Varanasi Kedarnath Somnath history"
  ],
  medium: [
    // New topics
    "Indian sweets - obscure regional sweets and their ingredients",
    "Non-famous ancient Indian temples - architecture and history",
    "Fill in the blank - obscure Bollywood songs from 1970s-1990s",
    "Fill in the blank - famous world literature quotes",
    "Current Indian government schemes - PM Kisan PMAY Jan Dhan details",
    "Historical events - obscure world history 1000 AD to 1900 AD",
    "Stock market trading - technical analysis candlestick patterns",
    "Stock market - derivatives futures options terminology",
    "Trading strategies - swing trading scalping arbitrage",
    "Computer Science - data structures algorithms complexity",
    "Computer Science - operating systems networking protocols",
    "Deep Mathematics - calculus differential equations series",
    "Deep Mathematics - number theory combinatorics probability",
    "Deep Economics - supply demand elasticity market structures",
    "Deep Economics - monetary policy RBI functions inflation control",
    "Deep Biology - cell biology mitosis meiosis genetics",
    "Deep Biology - human physiology endocrine system neurology",
    "Accounts - balance sheet income statement ratio analysis",
    "Accounts - GST TDS ITR financial statements",
    "Deep Physics - electromagnetism optics waves",
    "Deep Physics - thermodynamics laws and applications",
    "AI and Machine Learning - supervised unsupervised algorithms",
    "AI - neural networks deep learning architectures",
    "Mechanical Engineering - thermodynamics fluid mechanics",
    "Electrical Engineering - circuits transformers power systems",
    "Civil Engineering - structures materials soil mechanics",
    "Sales techniques - SPIN selling consultative selling",
    "Business strategy - Porter's Five Forces SWOT BCG matrix",
    "Startup ecosystem - funding rounds valuation term sheets",
    "Psychiatry - mental disorders DSM-5 classification treatment"
  ],
  hard: [
    // Extremely hard new topics
    "Obscure Indian sweets - exact preparation techniques and regional variants",
    "Ancient Indian temple inscriptions architecture Agama Shastra",
    "Fill in the blank - rare Sanskrit shlokas and their meanings",
    "Classified Indian government policies - budget allocations fiscal deficit",
    "Obscure world historical events - treaties diplomacy 15th-18th century",
    "Advanced stock trading - Black-Scholes model options Greeks delta gamma",
    "High frequency trading algorithms - market microstructure",
    "Advanced DSA - graph algorithms dynamic programming NP-hard problems",
    "Advanced Computer Networks - BGP OSPF TCP/IP internals",
    "Advanced Mathematics - topology abstract algebra group theory",
    "Advanced Mathematics - real analysis measure theory complex analysis",
    "Advanced Econometrics - regression time series ARIMA cointegration",
    "Advanced Macroeconomics - IS-LM Mundell-Fleming DSGE models",
    "Advanced Molecular Biology - CRISPR epigenetics proteomics",
    "Advanced Genetics - Hardy-Weinberg population genetics genomics",
    "Advanced Accounting - IFRS standards consolidation deferred tax",
    "Advanced Accounts - forensic accounting transfer pricing",
    "Quantum Physics - Schrodinger equation wave functions entanglement",
    "Quantum Physics - quantum field theory Feynman diagrams",
    "Advanced ML - transformer architecture attention mechanism BERT GPT",
    "Advanced AI - reinforcement learning policy gradient methods",
    "Mechanical Engineering - vibration analysis finite element method",
    "Electrical Engineering - power electronics control systems Bode plot",
    "Civil Engineering - geotechnical earthquake engineering seismic design",
    "Psychiatry - psychoanalytic theory Freud Jung Adler comparison",
    "Cognitive Psychology - memory models working memory Baddeley",
    "Advanced Business Strategy - game theory in business oligopoly",
    "Startup - unit economics CAC LTV cohort analysis burn rate",
    "Advanced Trading - quantitative finance Sharpe ratio VaR portfolio theory",
    "UPSC IAS level - Indian polity governance constitutional amendments",
    "IIT JEE Advanced level - physics chemistry mathematics problems",
    "NIMCET level - advanced discrete mathematics logical reasoning",
    "Banking exams IBPS level - financial awareness monetary policy",
    "SSC CGL advanced - general awareness current affairs reasoning",
    "Advanced Quantum Mechanics - Dirac equation spin operators angular momentum",
    "Neuroscience - synaptic plasticity LTP action potential ion channels",
    "Geopolitics - obscure international conflicts treaties alliances",
    "Advanced Indian Philosophy - Nyaya Vaisheshika Samkhya Mimamsa systems",
    "Rare Nobel Prize science - mechanism of awarded discoveries",
    "Thermodynamics - Carnot cycle entropy Gibbs free energy electrochemistry"
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

// Global question seen registry - persists across ALL sessions
var SEEN_REGISTRY_KEY = "kbg_seen_all_v2";
var _seenAll = (function() {
  try { return JSON.parse(localStorage.getItem(SEEN_REGISTRY_KEY) || "[]"); } catch(e) { return []; }
})();
// Strong deduplication: session set + localStorage set
var _seenThisSession = new Set();

function markSeen(qText) {
  if (!qText) return;
  var norm = qText.trim().toLowerCase().slice(0, 80);
  _seenThisSession.add(norm);
  try {
    var stored = JSON.parse(localStorage.getItem("kbg_seen_qs") || "[]");
    stored.push(norm);
    // Keep last 500 questions
    if (stored.length > 500) stored = stored.slice(-500);
    localStorage.setItem("kbg_seen_qs", JSON.stringify(stored));
  } catch(e) {}
}

function wasSeen(qText) {
  if (!qText) return false;
  var norm = qText.trim().toLowerCase().slice(0, 80);
  if (_seenThisSession.has(norm)) return true;
  try {
    var stored = JSON.parse(localStorage.getItem("kbg_seen_qs") || "[]");
    return stored.indexOf(norm) >= 0;
  } catch(e) { return false; }
}

async function fetchQ(idx) {
  var level = idx < 5 ? "easy" : idx < 10 ? "medium" : "hard";
  var topics = TOPICS_BY_LEVEL[level];
  var topic = topics[Math.floor(Math.random() * topics.length)];
  var seed = Math.floor(Math.random() * 9999999);

  var diff = idx === 0
    ? "MODERATE - not too easy, requires thinking. Avoid obvious questions like 'capital of India'. Ask something that requires actual knowledge like a specific date, person, formula or fact that an average person might not immediately know."
    : idx < 3
    ? "MEDIUM - requires specific knowledge. Ask about obscure facts, specific years, technical terms, or details that most people wouldn't know without studying. Options must all seem plausible."
    : idx < 5
    ? "HARD - requires deep subject knowledge. Ask tricky questions with confusing options. User should have to think carefully. Avoid any question that can be guessed from the question itself."
    : idx < 7
    ? "VERY HARD - graduate level. Specific technical facts, obscure details, exact figures, precise terminology. All 4 options must be extremely plausible. A random guess should rarely succeed."
    : idx < 9
    ? "EXPERT HARD - post-graduate specialist knowledge required. Ask about specific mechanisms, exact values, obscure historical details, technical specifications. Wrong options should be convincing decoys."
    : idx < 11
    ? "NEAR IMPOSSIBLE - only 5% of people would know this. Ask about highly specific obscure facts that even subject experts might second-guess. Options must be indistinguishable without precise knowledge."
    : idx < 13
    ? "BRUTALLY HARD - PhD research level. The most obscure specific fact in this topic. Wrong options must be so close to correct that even professors would struggle. No guessing should work."
    : idx < 15
    ? "DIABOLICALLY HARD - the rarest deepest fact in this topic. Something from advanced research papers, specific clauses, exact mechanisms, rare historical events. Options differ only in tiny specific details."
    : "IMPOSSIBLE - only world-class experts in this exact topic would know. Ask about the most obscure specific technical detail imaginable. All 4 options must look equally correct to anyone without precise memorized knowledge.";

  // Special instructions per question type
  var special = "";
  if (topic.indexOf("Fill in the blank") >= 0) {
    special = " Format: Show the text with ____ for the blank. Make the blank a crucial word that changes meaning.";
  } else if (topic.indexOf("sweets") >= 0 || topic.indexOf("temple") >= 0) {
    special = " Ask about specific obscure details - exact ingredients, geographical origin, specific ritual, exact location.";
  } else if (topic.indexOf("Trading") >= 0 || topic.indexOf("stock") >= 0 || topic.indexOf("Stock") >= 0 || topic.indexOf("trading") >= 0) {
    special = " Use precise financial terminology. Ask about exact formulas, specific regulations, technical indicators.";
  } else if (topic.indexOf("Coding") >= 0 || topic.indexOf("Computer") >= 0 || topic.indexOf("DSA") >= 0 || topic.indexOf("Algorithm") >= 0) {
    special = " Ask about specific syntax, algorithm complexity, exact output of code snippet, specific data structure property.";
  } else if (topic.indexOf("Mathematics") >= 0 || topic.indexOf("calculus") >= 0 || topic.indexOf("algebra") >= 0) {
    special = " Ask calculation-based questions with specific numerical answers. Options should differ by small amounts.";
  } else if (topic.indexOf("Physics") >= 0 || topic.indexOf("Quantum") >= 0) {
    special = " Ask about exact formulas, specific constants, precise experimental results, named effects and their discoverers.";
  } else if (topic.indexOf("UPSC") >= 0 || topic.indexOf("IIT") >= 0 || topic.indexOf("NIMCET") >= 0 || topic.indexOf("SSC") >= 0 || topic.indexOf("Banking") >= 0) {
    special = " Generate a question at the exact difficulty level of this exam. Use exam-style phrasing.";
  }

  var confuse = idx >= 3
    ? " CRITICAL: All 4 options must be specific, plausible, and confusing. Wrong options must be same category as correct - nearby numbers, similar names, related concepts. NEVER include obviously wrong options. User should genuinely not know."
    : "";

  // IMPORTANT: Ask API to ALWAYS put correct answer at index 0
  // We will shuffle client-side to guarantee true randomness
  var prompt = "KBC quiz question. Seed:" + seed + " Topic:" + topic + " Difficulty:" + diff + " Q" + (idx+1) + "/16." + special + confuse + "\nIMPORTANT: Put the correct answer at index 0 in options array (correct:0). We will shuffle later.\nReturn ONLY valid JSON:\n{\"question\":\"specific factual question?\",\"options\":[\"CORRECT_ANSWER\",\"wrong1\",\"wrong2\",\"wrong3\"],\"correct\":0,\"topic\":\"" + topic + "\",\"explanation\":\"2 sentences: why correct answer is right and why others are wrong.\"}";

  try {
    var data = await callAPI(prompt, 350);

    // Retry if seen before
    var attempts = 0;
    while (data && data.question && wasSeen(data.question) && attempts < 2) {
      var ns = Math.floor(Math.random() * 9999999);
      data = await callAPI(prompt.replace("Seed:" + seed, "Seed:" + ns), 350);
      attempts++;
    }

    if (data && data.question && Array.isArray(data.options) && data.options.length === 4) {
      markSeen(data.question);

      // Normalize correct index - handle if API returned something other than 0
      var correctIdx = (typeof data.correct === "number" && data.correct >= 0 && data.correct < 4) ? data.correct : 0;
      var correctAnswer = data.options[correctIdx];

      // GUARANTEED CLIENT-SIDE SHUFFLE using crypto-quality randomness
      // Use a hand-picked target position that cycles through 0,1,2,3 evenly
      // This is independent of API and guaranteed to be uniform
      var targetPos = Math.floor(Math.random() * 4); // true uniform 0-3

      // Build new options array: place correct answer at targetPos
      // Fill remaining positions with wrong answers in shuffled order
      var wrongs = [];
      for (var wi = 0; wi < 4; wi++) {
        if (wi !== correctIdx) wrongs.push(data.options[wi]);
      }
      // Shuffle wrongs using Fisher-Yates
      for (var fi = wrongs.length - 1; fi > 0; fi--) {
        var fj = Math.floor(Math.random() * (fi + 1));
        var ft = wrongs[fi]; wrongs[fi] = wrongs[fj]; wrongs[fj] = ft;
      }

      var finalOpts = [];
      var wi2 = 0;
      for (var oi = 0; oi < 4; oi++) {
        if (oi === targetPos) {
          finalOpts.push(correctAnswer);
        } else {
          finalOpts.push(wrongs[wi2++]);
        }
      }

      data.options = finalOpts;
      data.correct = targetPos;
    }
    return data;
  } catch(e) {
    return getOfflineQ(idx);
  }
}

async function translateQ(q) {
  var prompt = "You are a Hindi translator. Translate the following KBC quiz question and its 4 options into Hindi (Devanagari script). Keep proper nouns, numbers, scientific terms, and abbreviations in English.\n\nQuestion: " + q.question + "\nOption A: " + q.options[0] + "\nOption B: " + q.options[1] + "\nOption C: " + q.options[2] + "\nOption D: " + q.options[3] + "\nExplanation: " + (q.explanation || "") + "\n\nReturn ONLY this exact JSON format with no extra text:\n{\"question\":\"<Hindi question here>?\",\"options\":[\"<Hindi A>\",\"<Hindi B>\",\"<Hindi C>\",\"<Hindi D>\"],\"explanation\":\"<Hindi explanation>\"}";
  try {
    var result = await callAPI(prompt, 500);
    // Validate the result has proper structure
    if (!result.question || !Array.isArray(result.options) || result.options.length !== 4) {
      throw new Error("Invalid translation structure");
    }
    return result;
  } catch(e) {
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
".prize-panel{width:clamp(130px,15vw,175px);flex-shrink:0;display:flex;flex-direction:column}",
"@media(max-width:750px){.prize-panel{display:none}}",
".prize-box{background:linear-gradient(180deg,rgba(15,0,35,0.98),rgba(25,0,60,0.92));border:1px solid rgba(123,47,255,0.3);border-radius:12px;overflow:hidden;flex:1}",
".prize-header{font-family:'Bebas Neue',sans-serif;font-size:0.7rem;color:var(--gold);letter-spacing:2px;text-align:center;padding:6px 8px 4px;border-bottom:1px solid rgba(123,47,255,0.2);text-transform:uppercase;font-weight:700}",
".prize-list{display:flex;flex-direction:column-reverse;overflow-y:auto;height:calc(100% - 30px);scrollbar-width:none}",
".prize-list::-webkit-scrollbar{display:none}",
".prow{display:flex;align-items:center;padding:3px 8px;gap:4px;transition:all 0.3s;border-left:3px solid transparent}",
".prow.active{background:linear-gradient(90deg,rgba(255,215,0,0.18),rgba(255,165,0,0.06));border-left-color:var(--gold)}",
".prow.passed{opacity:0.3;border-left-color:rgba(0,255,136,0.25)}",
".prow.upcoming{opacity:0.44}",
".prow.safe-r{border-right:2px solid rgba(0,255,136,0.35)}",
".prow-q{font-family:'Exo 2',sans-serif;font-size:0.54rem;color:var(--dim);width:14px;flex-shrink:0;font-weight:600}",
".prow.active .prow-q{color:rgba(200,180,255,0.8)}",
".prow-p{font-family:'Bebas Neue',sans-serif;font-size:0.68rem;font-weight:500;flex:1;text-align:right;letter-spacing:0.5px}",
".prow.active .prow-p{color:var(--gold);font-size:0.78rem;font-weight:400;text-shadow:0 0 8px rgba(255,215,0,0.6);animation:activePrize 1s ease-in-out infinite alternate}",
"@keyframes activePrize{0%{text-shadow:0 0 4px rgba(255,215,0,0.4)}100%{text-shadow:0 0 14px rgba(255,215,0,0.9)}}",
".prow.passed .prow-p{color:rgba(0,255,136,0.6)}",
".prow.upcoming .prow-p{color:var(--dim)}",
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
    if (!q || !q.question || !q.options) return;
    setHindiData(null);
    setHindiReady(false);
    setIsHindi(false);
    // Pass the raw English question (q, not dq) to translateQ
    translateQ(q).then(function(hd) {
      if (hd && hd.question && Array.isArray(hd.options) && hd.options.length === 4) {
        setHindiData(hd);
        setHindiReady(true);
      } else {
        setHindiReady(false);
      }
    }).catch(function() {
      setHindiReady(false);
    });
  }, [currentQ]);

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
    if (hindiReady) setIsHindi(function(p) { return !p; });
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
  var trCls = "hbtn tr" + (isHindi ? " on" : hindiReady ? " rdy" : "");
  var trLbl = isHindi ? "English" : "Hindi";

  function PrizePanel() {
    return React.createElement("div", { className: "prize-panel" },
      React.createElement("div", { className: "prize-box" },
        React.createElement("div", { className: "prize-header" }, "Prize Ladder"),
        React.createElement("div", { className: "prize-list" },
          PRIZE_LADDER.slice().reverse().map(function(row, ri) {
            var i = 16 - ri;
            var cls = "prow" + (i === currentQ ? " active" : i < currentQ ? " passed" : " upcoming") + (row.safe ? " safe-r" : "");
            return React.createElement("div", { key: i, className: cls },
              React.createElement("span", { className: "prow-q" }, row.q),
              React.createElement("span", { className: "prow-p" }, "Rs." + row.prize),
              row.safe ? React.createElement("span", { style: { fontSize: "0.44rem", color: "rgba(0,255,136,0.7)" } }, "S") : null
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
            screen === "playing" && !revealed && React.createElement("button", { className: trCls, onClick: handleTranslate, disabled: !hindiReady }, trLbl),
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
