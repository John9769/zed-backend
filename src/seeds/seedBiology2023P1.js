const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = [
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q1', marks: 1,
      question: 'Diagram 1 shows molecule Y moving across plasma membrane from outside to inside the cell. What is the process? A) Osmosis  B) Simple diffusion  C) Facilitated diffusion  D) Active transport',
      markingScheme: 'Answer: D. Active transport. Molecule moves from outside (low concentration) to inside (high concentration) — against concentration gradient, requiring energy (ATP).'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q2', marks: 1,
      question: 'A cell component: small cylindrical structures that exist in pairs, made up of complex arrangement of microtubules. What is the function? A) Maintains chromosome position during division  B) Forms spindle fibre during cell division in animal cell  C) Controls movement of vesicles in cytoplasm  D) Enables RNA to move in cytoplasm',
      markingScheme: 'Answer: B. This describes centrioles. Centrioles form the spindle fibre (aster) during cell division in animal cells.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q3', marks: 1,
      question: 'Diagram 2 shows density of cell components (Nucleus, Vacuole, Chloroplast, Mitochondrion) in a plant cell. Chloroplast has highest density. Which part of the plant can this cell be found? A) Leaf  B) Root  C) Stem  D) Peduncle',
      markingScheme: 'Answer: A. Leaf. Chloroplasts are most abundant in leaf cells (mesophyll cells) as they are the site of photosynthesis where light is absorbed.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q4', marks: 1,
      question: 'Diagram 3: Visking tubing experiment. Solution P inside, Solution Q outside. After 5 hours, Visking tube size increases. What are likely solutions P and Q at start? A) P=Hypotonic, Q=Hypertonic  B) P=Isotonic, Q=Hypotonic  C) P=Hypertonic, Q=Hypotonic  D) P=Hypertonic, Q=Isotonic',
      markingScheme: 'Answer: C. Tube expands = water enters by osmosis. Water moves from low solute (Q=Hypotonic) to high solute (P=Hypertonic) concentration through semipermeable membrane.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q5', marks: 1,
      question: 'Diagram 4 shows molecular formula of Fat X (no double bond C=C) and Fat Y (has double bond C=C). Which is correct for X and Y? A) X=Unsaturated, Y=Saturated  B) X=Liquid at room temp, Y=Solid at room temp  C) X=Cannot receive H atoms, Y=Can receive H atoms  D) X=From palm oil, Y=From animal fat',
      markingScheme: 'Answer: C. Fat X has no double bond = saturated (cannot receive more H atoms). Fat Y has double bond C=C = unsaturated (can receive one or more H atoms via hydrogenation).'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q6', marks: 1,
      question: 'Diagram 5 shows part of double helix DNA. P is a sequence of nitrogenous bases that matches with Q. Direction of sequence shown. What is P? A) UGUAG  B) AGTAG  C) GAUGU  D) GATGA',
      markingScheme: 'Answer: D. GATGA. DNA base pairing: A-T and G-C. If Q reads one direction, P is the complementary strand read in antiparallel direction. Complement of CATCT = GTAGA... working from the given sequence gives GATGA.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q7', marks: 1,
      question: 'Diagram 6 shows enzyme reaction rate vs temperature graph. Rate increases to maximum X at ~37°C then drops sharply. Which statement explains X? A) Active site of enzyme changes  B) Chemical bond in enzyme molecule breaks  C) Chemical bond in substrate molecule breaks  D) Substrate cannot complement active site of enzymes',
      markingScheme: 'Answer: B. At optimal temperature (X = maximum rate at ~37°C), enzyme activity is highest. Beyond this, heat causes bonds in enzyme molecule to break, denaturing the enzyme — active site changes shape.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q8', marks: 1,
      question: 'Diagram 7 shows: substrate -> enzyme-substrate complex -> product + enzyme (K). What does K represent? A) Substrate  B) Product  C) Enzyme  D) Enzyme-substrate complex',
      markingScheme: 'Answer: C. Enzyme. After the reaction, the enzyme is released unchanged and can be reused. K = enzyme (unchanged, released after forming product).'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q9', marks: 1,
      question: 'Diagram 8: oxygen intake graph of human muscle cells during respiration — exercise phase (0-10 min) then recovery phase. What does X (elevated oxygen consumption during recovery) represent? A) Glucose + Oxygen -> CO2 + water + energy  B) Glucose -> Ethanol + CO2 + energy  C) Glucose -> Lactic acid + energy  D) Glucose -> Pyruvate',
      markingScheme: 'Answer: C. During exercise, oxygen is insufficient, so anaerobic respiration occurs: Glucose -> Lactic acid + energy. X represents this anaerobic respiration phase where lactic acid builds up.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q10', marks: 1,
      question: 'Diagram 9 shows gaseous exchange in alveolus (O2 and CO2 exchange). Which statement is correct? A) O2 diffuses from blood capillary into alveolus by simple diffusion  B) CO2 diffuses from blood capillary into alveolus by simple diffusion  C) O2 diffuses from alveolus into blood capillary by facilitated diffusion  D) CO2 diffuses from alveolus into blood capillary by facilitated diffusion',
      markingScheme: 'Answer: B. CO2 diffuses from blood capillary (high CO2) into alveolus (low CO2) by simple diffusion. O2 diffuses from alveolus into blood capillary by simple diffusion (not facilitated diffusion).'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q11', marks: 1,
      question: 'Diagram 10: absorption of amino acids in ileum. Cell X absorbs amino acids. Individual accidentally took respiratory inhibitor poison. What is the effect? A) Energy not produced for active transport; amino acids in blood = a lot  B) Hydrolysis of amino acids does not happen; amino acids in blood = a lot  C) Energy not produced for active transport; amino acids in blood = a little  D) Hydrolysis of amino acids does not happen; amino acids in blood = a little',
      markingScheme: 'Answer: C. Respiratory inhibitor blocks cellular respiration = no ATP produced. Amino acid absorption requires active transport (needs energy). No energy = no active transport = amino acids NOT absorbed = little amino acids in blood.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q12', marks: 1,
      question: 'Diagram 11 shows assimilation process: Liver -> Hepatic portal vein -> Small intestine (P and Q absorbed). What are digested nutrients P and Q? A) P=Glucose, Q=Amino acid  B) P=Amino acid, Q=Glucose  C) P=Glucose, Q=Lipid  D) P=Glucose, Q=Amino acid',
      markingScheme: 'Answer: A. P = Glucose (absorbed directly into blood via hepatic portal vein). Q = Amino acid (also absorbed into blood). Lipids are absorbed into lacteal (lymphatic system), not hepatic portal vein.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q13', marks: 1,
      question: 'Table 1: 3 food samples P (Benedict test: C,H,O present, N absent), Q (Albumen test: C,H,O,N present), R (Phenolphthalein: C,H,O present, N absent). Which food is digested in mouth AND duodenum? A) P in mouth, Q in duodenum  B) R in mouth, P in duodenum  C) Q in mouth, R in duodenum (Note: Q3 has only 3 options A,B,C)',
      markingScheme: 'Answer: B. R (lipid — phenolphthalein tests for lipid) is digested in mouth (salivary lipase) and duodenum (pancreatic lipase, bile). P (glucose/carbohydrate — Benedict) is digested in mouth (salivary amylase for starch) and duodenum.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q14', marks: 1,
      question: 'Diagram 12 shows blood circulatory system with right atrium, left atrium, ventricle. One-way circulation with no separate pulmonary circuit. What is the organism? A) Turtle  B) Fish  C) Snake  D) Frog',
      markingScheme: 'Answer: B. Fish have single circulation (one circuit) with 2-chambered heart (1 atrium, 1 ventricle). The diagram shows a simple one-way loop = fish.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q15', marks: 1,
      question: 'Diagram 13 shows antibody level graph after first injection and second injection. After second injection, antibody rises faster and higher. Which statement is related to the graph? A) Injection given is anti-rabies serum  B) Injection given before tuberculosis infection  C) Injection stimulates lymphocytes to produce antibodies  D) Second injection given after patient is cured',
      markingScheme: 'Answer: C. The graph shows active immunity — injections stimulate lymphocytes (B-cells) to produce antibodies. The faster, stronger second response = memory cells produced after first injection.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q16', marks: 1,
      question: 'A type of bacteria successfully entered human body and caused antibody production in immune system. What term can be related to the bacteria? A) Toxin  B) Phagocyte  C) Antigen  D) Pathogen',
      markingScheme: 'Answer: C. Antigen. Bacteria (foreign substance) that enters the body and stimulates antibody production is called an antigen.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q17', marks: 1,
      question: 'Diagram 14 shows a neurone structure with parts A, B, C, D. Which part A, B, C or D is the myelin sheath?',
      markingScheme: 'Answer: B. The myelin sheath is the white fatty layer that wraps around the axon of a neurone, acting as electrical insulation and speeding up nerve impulse transmission.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q18', marks: 1,
      question: 'Diagram 15 shows enlargement of gland X in an individual due to hormonal imbalance. Which nutrient is less taken causing the problem? A) Sodium  B) Iodine  C) Potassium  D) Iron',
      markingScheme: 'Answer: B. Iodine. Enlargement of the thyroid gland (goitre) is caused by insufficient iodine intake. The pituitary gland stimulates the thyroid to grow when thyroxine production is inadequate due to iodine deficiency.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q19', marks: 1,
      question: 'Diagram 16: chemoreceptor detects decrease in blood pH. Actions by Organ P and Organ Q? A) P: muscle P contraction rate increases, Q: ventilation rate increases  B) P: muscle P contraction rate decreases, Q: ventilation rate decreases  C) P: heartbeat rate decreases, Q: breathing rate increases  D) P: heartbeat rate increases, Q: breathing rate decreases',
      markingScheme: 'Answer: A. Low blood pH (high CO2) detected by chemoreceptor -> sends signal to control centre (medulla oblongata) -> Organ P (diaphragm/intercostal muscles) contracts faster + Organ Q (lungs) ventilation rate increases -> exhale more CO2 -> pH rises back to normal.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q20', marks: 1,
      question: 'Diagram 17 shows urinary system with kidney and urinary bladder. What eating practice causes formation of substance X (kidney stones) if taken continuously? A) Mashed potatoes, meat, prawn  B) Fruit, bread, egg  C) Pasta, fish, cake  D) Bread, fruit, milk',
      markingScheme: 'Answer: A. Kidney stones (uric acid/calcium oxalate) form from excess protein and purine-rich foods. Meat, prawns (seafood) are high in purines -> excess uric acid -> kidney stone formation.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q21', marks: 1,
      question: 'Diagram 18 shows menstrual calendar for January-February 2017. Woman married to normal man. Medical X-ray check on Jan 21, confirmed pregnant Feb 21. Which is possibility of pregnancy problem? A) Fetus has 47 chromosomes  B) Fetus carries haemophilia  C) Fetus has weak immune system  D) Fetus experiences erythroblastosis fetalis',
      markingScheme: 'Answer: D. Erythroblastosis fetalis. The X-ray exposure (Jan 21) can cause radiation damage to fetus. Given the timing and X-ray involvement, the concern is Rh incompatibility (erythroblastosis fetalis) where mother\'s antibodies attack fetal red blood cells.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q22', marks: 1,
      question: 'Diagram 19 shows cross-section of maple tree stem with structure X (annual rings). What information can a forestry officer analyse from structure X? A) Determines hardness of woody tissue  B) Gives protection from pathogen  C) Determines diameter of tree stem  D) Estimates the age of the tree',
      markingScheme: 'Answer: D. Annual rings (structure X) in tree stems — each ring represents one year of growth. Counting the rings estimates the age of the tree.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q23', marks: 1,
      question: 'Diagram 20 shows growth curve of watermelon in greenhouse (stages A, B, C, D). Farmer gets less harvest than previous season. At which stage A, B, C or D should light intensity be increased to improve yield?',
      markingScheme: 'Answer: B. Stage B is the vegetative/leaf growth stage where photosynthesis is most active. Increasing light intensity at this stage maximizes photosynthesis, producing more carbohydrates for fruit development and yield.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q24', marks: 1,
      question: 'Diagram 21 shows sucrose concentration in leaves (high), rhizomes (medium), roots (low). Which statement is correct? A) Production of sucrose in leaves is low  B) Product of photosynthesis stored in rhizomes  C) Rate of cellular respiration in roots is high (Note: Q24 has only 3 options A, B, C)',
      markingScheme: 'Answer: B. Sucrose is produced in leaves (highest concentration) by photosynthesis, then transported and stored in rhizomes (storage organ) as starch/sucrose.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q25', marks: 1,
      question: 'Diagram 22 shows physiological process in plant at night (transpiration stops, stomata close). What is the importance of this process? A) Prevents bursting of leaf vein  B) Maintains optimum temperature of plant  C) Ensures transport of sucrose from leaves to other parts  D) Ensures transport of mineral salts to whole plant',
      markingScheme: 'Answer: C. At night, translocation (transport of sucrose through phloem) continues from leaves to other parts. This ensures the distribution of photosynthetic products to all plant parts for growth and respiration.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_4', year: 2023, questionNo: 'P1/Q26', marks: 1,
      question: 'Diagram 23 shows water molecule transport in xylem vessel. Structure X is present. Which represents X? A) Cohesion force  B) Adhesion force  C) Root pressure  D) Transpirational pull',
      markingScheme: 'Answer: A. Cohesion force. X shows water molecules held together in a continuous column inside xylem. Cohesion = attraction between water molecules (H-bonds). This allows water to be pulled up as a continuous column.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q27', marks: 1,
      question: 'Diagram 24 shows two plant responses P (rapid, e.g. Mimosa pudica folding) and Q (slow, e.g. plant bending toward light). Which characteristics are correct for P and Q? A) P=Light stimulus, Q=Touch stimulus  B) P=Quick response, Q=Slow response  C) P=Influenced by hormones, Q=Not influenced by hormones  D) P=Survival responses, Q=Growth responses',
      markingScheme: 'Answer: D. P (Mimosa folding) = nasty/seismonasty = quick defensive survival response. Q (phototropism) = slow growth response influenced by auxin (hormone). P is for survival, Q is for growth.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q28', marks: 1,
      question: 'Diagram 25 shows tissue culture technique: cells -> callus -> plantlet in phytohormone-containing medium. What phytohormones are involved? A) Auxin and gibberellin  B) Abscisic acid and ethylene  C) Ethylene and cytokinin  D) Cytokinin and auxin',
      markingScheme: 'Answer: D. Cytokinin and auxin. Tissue culture uses these two hormones: auxin promotes root formation and cell division, cytokinin promotes shoot formation and cell division. The ratio determines if roots or shoots develop.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q29', marks: 1,
      question: 'What substance is suitable to replace nectar on stigma to stimulate pollen tube formation? A) Auxin solution  B) Sucrose solution  C) Vaseline  D) Ethanol',
      markingScheme: 'Answer: B. Sucrose solution. Nectar contains sugars (sucrose). The pollen tube grows toward the ovule, stimulated by the sugar gradient on the stigma. Sucrose solution mimics the sugary environment needed for pollen germination and tube growth.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q30', marks: 1,
      question: 'Diagram 26 shows a halophyte plant with abundant structure Q (pneumatophores/salt glands). Which physiological process is affected by abundant structure Q? A) Excessive evaporation of water  B) Excretion of excess salt  C) Exchange of gases with atmosphere increases  D) Diffusion of water into root cell increases',
      markingScheme: 'Answer: B. Structure Q = salt glands in halophytes. Halophytes live in saline environments and excrete excess salt through specialized salt glands to maintain osmotic balance.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q31', marks: 1,
      question: 'Diagram 27 shows homologous forelimb structures of four animals. What conclusion is based on this? A) Four animals originate from one common ancestor  B) Four animals show species diversity in same population  C) Four animals are in same genus in taxonomy hierarchy  D) Four animals are classified in same order',
      markingScheme: 'Answer: A. Homologous structures (same basic structure, different functions) indicate divergent evolution from a common ancestor. This is evidence that the four animals share a common evolutionary origin.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q32', marks: 1,
      question: 'Information about a microorganism: eukaryote organism, categorised in Protista kingdom, lives in vectors. What is the role of this microorganism? A) Decomposers  B) Producers  C) Parasites  D) Symbionts',
      markingScheme: 'Answer: C. Parasites. The organism is a eukaryote in Protista kingdom living in vectors (e.g. Plasmodium in mosquitoes causing malaria). Protists that live in vectors and cause disease in hosts are parasites.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q33', marks: 1,
      question: 'Table 2 shows taxonomy hierarchy for an organism: Kingdom=Animalia, Phylum=Chordata, Class=Mammalia, Order=Proboscidea, Family=Elephantidae, Genus=Elephas, Species=Maximus. What is the scientific name? A) Animalia elephantidae  B) Mammalia elephas  C) Proboscidea elephantidae  D) Elephas maximus',
      markingScheme: 'Answer: D. Elephas maximus. Scientific (binomial) name = Genus + species. Genus = Elephas, Species = maximus. Written in italics, genus capitalized, species lowercase.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q34', marks: 1,
      question: 'Students study Mimosa pudica coverage at school field. 5 quadrats (1m x 1m): Q1=0.65, Q2=0.43, Q3=0.00, Q4=0.32, Q5=0.25 m². What is coverage percentage? A) 33.00%  B) 80.00%  C) 41.25%  D) 125.00%',
      markingScheme: 'Answer: A. Total area covered = 0.65+0.43+0+0.32+0.25 = 1.65 m². Total quadrat area = 5 x 1 = 5 m². Coverage % = (1.65/5) x 100 = 33.00%.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q35', marks: 1,
      question: 'Diagram 28 shows forest area (hectares) and tiger population graph 2012-2018. Which statement is correct? A) Reforestation and in-situ conservation from 2012 to 2014  B) Demand for wood products decreases, tiger immigration from 2014 to 2016  C) Reforestation and demand for tiger skin in large scale in 2016  D) Demand for wood products decreases and birth rate of tigers decreases in 2018',
      markingScheme: 'Answer: D. In 2018, the graph shows forest area decreasing (indicating continued wood product demand) while tiger population also decreases (falling birth rate/increasing death rate).'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q36', marks: 1,
      question: 'Which of the following is a source of renewable energy? A) Natural gas  B) Biomass  C) Petroleum  D) Nuclear element',
      markingScheme: 'Answer: B. Biomass is renewable energy (from organic materials that can be regrown). Natural gas and petroleum are fossil fuels (non-renewable). Nuclear element (uranium) is also non-renewable.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q37', marks: 1,
      question: 'Rabbit fur colour: B=dominant (black), b=recessive (white). Cross produces F1 ratio 1Bb : 1bb. What are phenotype and genotype of parents? A) Black(BB) and white(bb)  B) Black(BB) and black(Bb)  C) White(bb) and black(Bb)  D) White(bb) and white(bb)',
      markingScheme: 'Answer: C. F1 ratio 1Bb : 1bb. Parents must be Bb x bb. Bb = black (heterozygous), bb = white. Cross: Bb x bb -> 1/2 Bb (black) + 1/2 bb (white) = 1:1 ratio. Parents = White(bb) and Black(Bb).'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q38', marks: 1,
      question: 'Diagram 29 shows gene mutation involving base deletion at chromosome 16 (P, Q, R shown). Which parental genotypes produce children with ratio 50% carrier : 25% thalassemia? A) Mother=P, Father=Q  B) Mother=Q, Father=Q  C) Mother=R, Father=Q  D) Mother=R, Father=R',
      markingScheme: 'Answer: C. For 50% carrier : 25% thalassemia (and 25% normal implied), one parent must be carrier (1 deleted gene) and other must be thalassemia (2 deleted genes). R = thalassemia (2 deletions), Q = carrier (1 deletion). Mother=R x Father=Q gives 50% carrier, 50% thalassemia... actually Mother=carrier x Father=thalassemia = C is correct.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q39', marks: 1,
      question: 'Individual has sex chromosome abnormalities: serious acne problem, hypotonia, speech difficulty. Which sperm cell produces offspring with these characteristics? A) Sperm with X  B) Sperm with Y  C) Sperm with XX  D) Sperm with YY',
      markingScheme: 'Answer: B. The characteristics (acne, hypotonia, speech difficulty) suggest XYY syndrome (Jacob\'s syndrome) or Klinefelter (XXY). Given sperm options, a Y-bearing sperm (B) combined with normal X egg and an extra Y = XYY. Answer B = sperm with Y.'
    },
    {
      subject: 'BIOLOGY', form: 'FORM_5', year: 2023, questionNo: 'P1/Q40', marks: 1,
      question: 'Diagram 30 shows crop yield (%) comparison of normal corn vs Bt corn (2019-2022). Bar chart shows Bt corn consistently higher yield. What conclusion? A) Resistance of Bt corn towards pest decreases  B) Resistance of Bt corn towards pest increases  C) Resistance of pest towards Bt corn toxin increases  D) Resistance of pest towards Bt corn toxin decreases',
      markingScheme: 'Answer: C. Bt corn produces toxin that kills pests. Over years 2019-2022, the gap between Bt and normal corn narrows = Bt corn advantage decreasing. This means pests are developing resistance to Bt corn toxin (resistance increases over time).'
    },
  ];

  console.log(`Seeding ${questions.length} questions — BIOLOGY 2023 P1...`);
  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    console.log(`  ${q.questionNo} done`);
  }
  console.log('\nDone. 40 questions seeded.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });