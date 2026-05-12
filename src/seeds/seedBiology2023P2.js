const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing Biology P2 2023 records first
  await prisma.pastYearQuestion.deleteMany({
    where: { subject: 'BIOLOGY', year: 2023, questionNo: { startsWith: 'P2' } },
  });
  console.log('Cleared existing Biology P2 2023 records.');

  const questions = [
    // ─────────────────────────────────────────────
    // SECTION A — Answer ALL questions [60 marks]
    // ─────────────────────────────────────────────

    {
      subject: 'BIOLOGY',
      form: 'FORM_5',
      year: 2023,
      questionNo: 'P2-A-Q1',
      question: `Phototropism is a type of tropism response. Diagram 1.1 shows another type of tropism response of a plant (growing around wooden stakes).

(a) Based on Diagram 1.1,
    (i)  State the type of response. [1 mark]
    (ii) State the stimulus for the response. [1 mark]

(b) Explain how the tropism response at the shoot helps on plant's survival. [2 marks]

(c) The following statement is about nastic tropism:
    "Nastic tropism is a response that is quicker and more apparent compared to tropism response."
    (i)  State ONE type of nastic response. [1 mark]
    (ii) Diagram 1.2 shows the response of a plant when it is touched (Mimosa folding leaves).
         Give ONE benefit of this type of response to the plant. [1 mark]`,
      markingScheme: `(a)(i) Thigmotropism (gerak balas sentuhan)
(a)(ii) Touch / mechanical contact / physical contact stimulus

(b) The shoot grows and wraps around the wooden stake, gaining physical support to grow upright. This allows the plant to grow towards sunlight for photosynthesis, ensuring survival and reproduction.
(Any 2 valid points, 1 mark each)

(c)(i) Seismonasty / thermonasty / photonasty / nyctinasty
       (accept any ONE valid nastic response)

(c)(ii) Protects the plant from predators / insects / herbivores by quickly folding leaves to appear smaller or less palatable, deterring animals from eating it.`,
      marks: 6,
    },

    {
      subject: 'BIOLOGY',
      form: 'FORM_4',
      year: 2023,
      questionNo: 'P2-A-Q2',
      question: `Diagram 2.1 shows Process X that occurs when a plant cell is immersed in distilled water. Water molecules are shown moving into the vacuole.

(a) (i)  State the name of Process X. [1 mark]
    (ii) Complete Diagram 2.2 by drawing the condition of the vacuole after being immersed in distilled water for 30 minutes. [1 mark]

(b) Diagram 2.3 shows the conditions of an animal cell being immersed in 10% sodium chloride solution (cell becomes crenated/shrivelled after immersion).
    Explain how this condition occurs. [2 marks]

(c) A climber was found in a very weak condition due to dehydration after getting lost for a few days. She was treated with saline solution.
    Explain why the treatment is given. [2 marks]`,
      markingScheme: `(a)(i) Osmosis

(a)(ii) The vacuole is drawn larger / fully expanded. The cell becomes turgid with the vacuole pressing against the cell wall.

(b) The 10% NaCl solution is hypertonic — its concentration is higher than the cytoplasm concentration / water potential outside is lower than inside. Water moves out of the cell by osmosis through the partially permeable plasma membrane from a region of higher water potential (inside cell) to lower water potential (outside). The cell loses water, cytoplasm shrinks, and the cell becomes crenated/shrivelled.

(c) Saline solution is isotonic to body fluids (same concentration as blood plasma). It safely replaces the lost body fluids / restores water balance without causing further osmotic changes. This rehydrates body cells and restores normal physiological function, allowing recovery from dehydration.`,
      marks: 6,
    },

    {
      subject: 'BIOLOGY',
      form: 'FORM_5',
      year: 2023,
      questionNo: 'P2-A-Q3',
      question: `Diagram 3.1 shows a part of a cross-section of eudicot root structure with root hair labelled.

(a) Complete Diagram 3.1 by drawing and labelling the structure of the vascular cylinder. [2 marks]

(b) Root hair cells function to absorb water and minerals.
    Explain ONE adaptation of root hair cells to carry out its function efficiently.
    State the example of disaccharide in:
    Adaptation: ................................................
    Explanation: ................................................ [2 marks]

(c) Diagram 3.2 shows Plant J growing on a host tree (epiphyte).
    (i)  State the effect on the growth of the host. [1 mark]
    (ii) Plant J is transferred and planted in a rocky and sandy area. The plant is also exposed to hot sunlight.
         Explain why the growth of Plant J is slower in the new environment. [2 marks]`,
      markingScheme: `(a) Drawing must show:
    - Xylem: star-shaped / X-shaped arrangement at centre
    - Phloem: located between the arms of xylem
    - Both correctly labelled (1 mark each structure, max 2 marks)

(b) Adaptation: Root hair cells have long, thin hair-like extensions (root hairs) that greatly increase the surface area.
    Explanation: The large surface area increases the rate of water absorption by osmosis and mineral ion absorption by active transport / diffusion, making absorption more efficient.

(c)(i) The growth of the host tree is inhibited / reduced / slowed down because Plant J blocks sunlight / competes for light and space, reducing the host's rate of photosynthesis.

(c)(ii) Rocky and sandy soil has poor water-holding capacity and low mineral/nutrient content. Less water is available for absorption. Hot sunlight causes excessive transpiration / water loss through stomata. Reduced water and minerals limit photosynthesis and cell growth, resulting in slower growth of Plant J.`,
      marks: 7,
    },

    {
      subject: 'BIOLOGY',
      form: 'FORM_5',
      year: 2023,
      questionNo: 'P2-A-Q4',
      question: `Diagram 4.1 shows two types of tissues (Tissue K and Tissue L) involved in a plant's transport system.

(a) Identify tissues K and L. [2 marks]

(b) (i)  Tissue K plays a role in giving support to the plant.
         State ONE adaptation on Tissue K to carry out this function. [1 mark]
    (ii) Explain the importance of the adaptation stated in 4(b)(i) in the economic aspect. [2 marks]

(c) Diagram 4.2 shows mango fruits P and Q before the ring of bark is removed from the tree stem. Diagram 4.3 shows their condition after the ring of bark is removed. Based on both diagrams, differentiate the conditions of mango P and mango Q after 1 month. [2 marks]`,
      markingScheme: `(a) K: Xylem
    L: Phloem

(b)(i) Xylem vessel walls are thick and lignified (contain lignin) / cells are dead with no cross walls / hollow lumen.

(b)(ii) Lignified xylem walls give strong structural support, allowing plants to grow tall. Tall trees with strong wood are commercially valuable in the timber / furniture / construction industry, generating economic income / high market value.

(c) Mango P (above ring cut): Becomes larger / ripens faster / sweeter after 1 month — phloem above the ring still transports organic food (sucrose from leaves) to fruit P.

Mango Q (below ring cut): Remains small / does not ripen / withers — the ring removes the phloem layer, blocking transport of organic food downward to fruit Q. Fruit Q receives no organic nutrients.`,
      marks: 7,
    },

    {
      subject: 'BIOLOGY',
      form: 'FORM_4',
      year: 2023,
      questionNo: 'P2-A-Q5',
      question: `Diagram 5.1 shows a cell cycle. Phases labelled are G1, Phase X, G2, Phase Y, Cytokinesis/Mitosis, and Phase Z.

(a) (i)  State the names of phases X and Z. [2 marks]
    (ii) State what happens to the chromosome during phase Y. [1 mark]

(b) Diagram 5.2 shows the cytokinesis that occurs in the animal cell and the plant cell.
    Complete Diagram 5.2 by drawing the stages of cytokinesis in the spaces provided. [2 marks]

(c) Diagram 5.3 shows a technique in biotechnology that uses mitosis:
    Explant taken from plant → Callus formed on nutrient agar → Plantlet formed.
    (i)  State the technique used in Diagram 5.3. [1 mark]
    (ii) The technique is used widely in the agriculture field to produce tomato plants rather than sowing seeds.
         Explain the benefits of the technique used for growing tomato plants. [2 marks]`,
      markingScheme: `(a)(i) X: S phase (Synthesis phase) — DNA replication/synthesis occurs
       Z: M phase (Mitosis phase) / mitosis

(a)(ii) During Phase Y (G2 phase): DNA replication is complete / chromosomes have been duplicated. The cell prepares for division. Chromosomes begin to condense. (Accept: chromosomes are replicated and the cell prepares for mitosis)

(b) Animal cell cytokinesis: A cleavage furrow forms at the equator, pinches inward from the plasma membrane, divides cytoplasm into two daughter cells.
    Plant cell cytokinesis: Vesicles (from Golgi) align along the cell plate at the equator, fuse to form a new cell wall (cell plate) that extends outward until two daughter cells are separated.

(c)(i) Tissue culture (Kultur tisu)

(c)(ii) - Produces large numbers of genetically identical plants (clones) with desired traits from a single explant quickly.
         - Plants produced are disease-free / pathogen-free.
         - Does not depend on seasonal seed availability / can produce plants year-round.
         - Saves time compared to growing from seeds / faster mass production.`,
      marks: 8,
    },

    {
      subject: 'BIOLOGY',
      form: 'FORM_4',
      year: 2023,
      questionNo: 'P2-A-Q6',
      question: `Diagram 6 shows a grassland ecosystem. Organisms visible include a bird of prey (Organism R), rabbits/cows (Organism S), and grass/trees.

(a) State TWO abiotic components in Diagram 6. [2 marks]

(b) Construct ONE pyramid of numbers that involves three organisms in the ecosystem in Diagram 6. [1 mark]

(c) Explain the differences between organism R and organism S based on their nutritional habits. [2 marks]

(d) A group of students conducted a field study to estimate the population size of organism S using the capture-mark-release-recapture technique.
    Table 1 results:
    - First capture: 22 organisms marked and released
    - Second capture: 11 marked, 3 unmarked
    Calculate the population size of organism S. [3 marks]`,
      markingScheme: `(a) Any TWO of: sunlight / light, water, temperature, air / wind, soil, humidity
    (1 mark each, max 2 marks)

(b) Correct pyramid (base to top, numbers decreasing):
    Grass (producer) — largest base
    Organism S / rabbit (primary consumer) — middle
    Organism R / bird (secondary/tertiary consumer) — smallest top
    (Must be drawn as a pyramid shape with correct sequence)

(c) Organism R (bird/eagle): Carnivore / secondary or tertiary consumer. Obtains energy by consuming other animals (Organism S). Does not eat plants directly.
    Organism S (rabbit): Herbivore / primary consumer. Obtains energy by eating plants / grass (producers). Does not consume other animals.

(d) Lincoln-Petersen formula:
    Population size = (N1 × N2) / R
    where N1 = first capture = 22, N2 = total second capture = 11 + 3 = 14, R = marked in second capture = 11

    Population size = (22 × 14) / 11
                    = 308 / 11
                    = 28

    Population size of Organism S = 28`,
      marks: 8,
    },

    {
      subject: 'BIOLOGY',
      form: 'FORM_5',
      year: 2023,
      questionNo: 'P2-A-Q7',
      question: `Diagram 7.1(a) and Diagram 7.1(b) show graphs of two types of variation.
Diagram 7.1(a): Bar chart with only 2-3 distinct categories (Characteristic X).
Diagram 7.1(b): Bar chart showing a bell-shaped distribution (Characteristic Y).

(a) Based on Diagram 7.1(a),
    (i)  State the type of variation. [1 mark]
    (ii) Give ONE example of characteristic X. [1 mark]

(b) Identify the distribution curve for the graph in Diagram 7.1(b). [1 mark]

(c) Diagram 7.2(a) shows identical twins J and K, both with fair skin during childhood. Diagram 7.2(b) shows twin J with darker skin after 20 years.
    (i)  State the factor that causes the change in skin colour of twin J. [1 mark]
    (ii) Explain how the factor in 7(c)(i) causes the change in skin colour of twin J. [2 marks]

(d) Twin J is diagnosed with skin cancer due to his work environment but his identical twin K does not suffer from skin cancer. If twin J has children, they will not be born with skin cancer.
    Explain why. [3 marks]`,
      markingScheme: `(a)(i) Discontinuous variation (variasi tak selanjar)

(a)(ii) Any ONE: Blood group (ABO) / ability to roll tongue / attached or free earlobes / sex (male/female) / ability to taste PTC

(b) Normal distribution curve (taburan normal) / bell-shaped curve

(c)(i) Environmental factor: sunlight / UV radiation / exposure to sunlight

(c)(ii) UV radiation from sunlight stimulates melanocytes in the skin to produce more melanin pigment. The increased amount of melanin causes the skin of twin J to become darker. This is an acquired characteristic due to an environmental (not genetic) influence.

(d) The skin cancer in twin J is caused by a somatic cell mutation (mutation in body/skin cells) due to environmental UV radiation — it is NOT a germline mutation.
    Somatic mutations occur in body cells only and are NOT present in the gametes (sperm or egg cells) of twin J.
    Since the mutation is not in the gametes, it cannot be passed on to offspring during fertilisation.
    Therefore, twin J's children will not inherit the mutation and will not be born with skin cancer.`,
      marks: 9,
    },

    {
      subject: 'BIOLOGY',
      form: 'FORM_5',
      year: 2023,
      questionNo: 'P2-A-Q8',
      question: `Diagram 8.1 shows muscle M of a football player that is injured during a training session.

(a) (i)  Suggest ONE method that can be used to treat the injury and give a reason. [2 marks]
    (ii) After a week, the player participates in a training session. His kick is not as great as before the injury.
         Explain why the condition occurs. [3 marks]

(b) Diagram 8.2 shows a normal human vertebral column with vertebrae S (thoracic region) and T (lumbar region) labelled.
    Based on Diagram 8.2, differentiate vertebrae S and T in terms of structure. [2 marks]

(c) Diagram 8.3 shows a human vertebral column with an abnormal lateral curvature (scoliosis-like condition).
    Describe how the condition occurs. [2 marks]`,
      markingScheme: `(a)(i) Method: Rest the injured muscle / apply ice pack / physiotherapy / immobilise with bandage.
       Reason: Resting allows torn muscle fibres to heal and regenerate / applying ice reduces inflammation, swelling, and pain / promotes faster recovery.

(a)(ii) The injured muscle M has not fully healed — muscle fibres are still damaged/weakened or reduced in number.
        The muscle cannot generate the same force of contraction as before the injury.
        This results in a weaker kicking force compared to before the injury.
        (Additionally, muscle atrophy may occur due to reduced use during recovery, further weakening the muscle.)
        (Any 3 valid points)

(b) Vertebra S (thoracic vertebra):
    - Smaller / less broad vertebral body
    - Has articular facets for rib attachment
    - Smaller / more circular vertebral foramen
    - Pointed / downward-sloping spinous process

    Vertebra T (lumbar vertebra):
    - Larger, broader, kidney-shaped vertebral body to support greater body weight
    - No facets for rib attachment
    - Larger, triangular vertebral foramen
    - Short, broad horizontal spinous process

    (Accept any 2 correct structural differences, 1 mark each)

(c) The condition (lateral curvature / scoliosis) occurs when the muscles on one side of the vertebral column are weaker than the other side / due to poor posture over prolonged periods / uneven loading of the spine. The stronger muscles pull the vertebral column to one side, causing it to curve laterally away from the normal vertical alignment. This results in an abnormal S-shaped or C-shaped curvature of the spine.`,
      marks: 9,
    },

    // ─────────────────────────────────────────────
    // SECTION B — Answer 2 questions [20 marks each]
    // ─────────────────────────────────────────────

    {
      subject: 'BIOLOGY',
      form: 'FORM_5',
      year: 2023,
      questionNo: 'P2-B-Q9',
      question: `(a) Diagram 9.1 shows a membrane lining (ciliated epithelium with mucus in the trachea) involved in the human first line of defence.
    Explain how the membrane lining destroys the bacteria in the air that enters the respiratory system. [2 marks]

(b) Diagram 9.2 shows a part of the skin of an individual pricked with a contaminated needle. After a few days, pus forms at the wound. The diagram shows bacteria entering through the skin, histamine released, and blood capillaries present.
    Describe how does the injury stimulate the response of the body defence system of the individual to overcome the infection. [8 marks]

(c) The following information shows two different situations related to immunity in humans:

    Situation 1: Pneumococcal disease is caused by Streptococcus pneumoniae which causes infections in meningitis and ears. According to the National Immunisation Schedule, 4-month-old children must be given the first pneumococcal injection to prevent the disease, followed by the second at 6 months and the third at 15 months.

    Situation 2: Insect stings such as wasps commonly cause pain, swelling, and redness. The venom from the insect flows throughout the victim's body, causing toxic reactions and allergies such as fainting and a drop in blood pressure. An antihistamine injection can be given as treatment. This antihistamine injection should be given if a person is stung again by this insect.

    Compare and contrast the types of immunity involved in the two situations. [10 marks]`,
      markingScheme: `(a) The ciliated epithelium secretes mucus that traps bacteria and dust particles entering with inhaled air.
    The cilia beat rhythmically, sweeping the mucus (with trapped bacteria) upward toward the throat where it is swallowed or expelled.
    Bacteria are then destroyed by the acidic environment of the stomach / expelled from the respiratory system.
    (2 marks — 1 for mucus trapping, 1 for cilia sweeping/destroying bacteria)

(b) Second line of defence — Inflammatory Response (non-specific):
    1. Bacteria enter through the skin puncture wound.
    2. Damaged tissue cells / mast cells release histamine.
    3. Histamine causes vasodilation: blood capillaries dilate and become more permeable.
    4. Increased blood flow causes redness, swelling, heat, and pain (classic signs of inflammation).
    5. Increased capillary permeability allows phagocytes (neutrophils, macrophages) to migrate out of blood vessels to the infection site (diapedesis).
    6. Phagocytes engulf and digest bacteria through phagocytosis.
    7. Dead bacteria, dead phagocytes, and tissue fluid accumulate as pus.

    Third line of defence — Specific Immune Response:
    8. Antigens on the bacterial surface are recognised by lymphocytes.
    9. B-lymphocytes are activated and differentiate into plasma cells that produce specific antibodies.
    10. Antibodies bind to bacterial antigens → agglutination / lysis / neutralisation of bacteria.
    11. T-lymphocytes (cytotoxic T cells) destroy infected cells directly.
    12. Memory B and T cells are formed for rapid response if the same bacteria invade again.
    (8 marks — award 1 mark per correct point, max 8)

(c) Comparison of Immunity Types:

    Situation 1 — Artificial Active Immunity (vaccination):
    + Involves injection of antigen (pneumococcal vaccine — killed/weakened bacteria)
    + Body is stimulated to produce its own antibodies
    + Memory cells (B and T) are formed
    + Long-lasting / permanent protection
    + Slow initial response (takes time for antibody production)
    + Requires multiple doses (booster shots at 4 months, 6 months, 15 months)
    + Body actively participates in producing immunity

    Situation 2 — Artificial Passive Immunity (antihistamine/antivenom injection):
    + Involves injection of ready-made antibodies (antihistamine) produced externally
    + Body does NOT produce its own antibodies
    + No memory cells formed
    + Short-lasting / temporary protection
    + Immediate/rapid protection
    + Must be repeated each time the person is stung (no lasting immunity)
    + Body passively receives antibodies

    Similarities: Both are artificial immunity (introduced into the body artificially / not naturally acquired). Both provide protection against a specific antigen/allergen. Both involve the immune system in some way.

    (10 marks — award marks for correct comparison points, similarity, and differences clearly stated)`,
      marks: 20,
    },

    {
      subject: 'BIOLOGY',
      form: 'FORM_5',
      year: 2023,
      questionNo: 'P2-B-Q10',
      question: `(a) (i)  Diagram 10.1 shows a hummingbird feeding from a flower.
         Explain the role of the organism in assisting the transfer of gamete of the flower. [2 marks]

    (ii) Diagram 10.2 shows the development of an embryo in a plant. The zygote divides mitotically to form basal and terminal cells, developing into an embryo. Structure T is labelled.
         Predict what will happen to the seed development if structure T fails to form. [4 marks]

    (iii) Diagram 10.3 shows a longitudinal section of a mango fruit with testa labelled.
          Explain the importance of seeds for the survival of mango plant species. [4 marks]

(b) Diagram 10.4 shows a longitudinal section of a flower. P and Q are results of processes that happen in structures M and N respectively.
    Compare and contrast:
    - Structures M and N
    - Production processes of P and Q
    [10 marks]`,
      markingScheme: `(a)(i) The hummingbird feeds on nectar from the flower. While feeding, pollen grains from the anther (structure M) stick to the bird's body/feathers/beak.
    When the bird visits another flower of the same species, the pollen grains are transferred to the stigma of that flower, enabling cross-pollination and fertilisation of the ovule.
    (2 marks — 1 for pollen sticking to bird, 1 for transfer to stigma/enabling pollination)

(a)(ii) Structure T is the endosperm nucleus / endosperm tissue (formed from triple fusion of 2 polar nuclei + 1 sperm nucleus).
    If structure T fails to form:
    1. There is no endosperm tissue formed inside the seed.
    2. The developing embryo has no food reserve / nutrient supply.
    3. The embryo cannot obtain nutrients for growth and cell division.
    4. The seed will not develop completely / embryo will die.
    5. The seed will fail to germinate / seedling cannot survive after germination.
    (4 marks — 1 mark per valid consequence)

(a)(iii) Importance of seeds for survival of mango plant species:
    1. Each seed contains an embryo — a new mango plant can grow from it, continuing the species.
    2. The seed contains food reserves (cotyledons / endosperm) to nourish the embryo during germination.
    3. The testa (seed coat) protects the embryo from desiccation, mechanical damage, and pathogens.
    4. Seeds can be dispersed by animals, wind, or water to new locations — widens the distribution of the species.
    5. Seeds can remain dormant during unfavourable conditions (drought, cold) and germinate when conditions improve — ensuring species survival.
    6. Sexual reproduction through seeds promotes genetic variation, increasing adaptability to changing environments.
    (4 marks — 1 mark per valid point)

(b) Comparison of Structure M and Structure N / Process P and Process Q:

    Structure M (Anther) vs Structure N (Ovule inside Ovary):
    M — Located at the tip of the stamen / male reproductive organ
    N — Located inside the ovary / female reproductive organ

    M — Contains pollen sacs (microsporangia)
    N — Contains embryo sac (megasporangium)

    M — Produces pollen grains (P) / male gametes
    N — Produces ovum/egg cell (Q) / female gametes

    M — Has 4 pollen sacs that open (dehisce) to release pollen
    N — Has protective integuments surrounding the embryo sac

    Production of P (Pollen grain — Microsporogenesis):
    - Pollen mother cells (diploid 2n) in anther undergo meiosis
    - Produces 4 haploid (n) microspores
    - Each microspore develops into a pollen grain
    - Pollen grain contains: generative nucleus (becomes 2 sperm nuclei) + tube nucleus

    Production of Q (Ovum/Egg cell — Megasporogenesis):
    - Ovule mother cell (diploid 2n) in ovule undergoes meiosis
    - Produces 4 haploid (n) megaspores (3 degenerate, 1 functional)
    - Functional megaspore undergoes 3 mitotic divisions → embryo sac with 8 nuclei
    - Embryo sac contains: 1 egg cell (Q) + 2 synergids + 3 antipodal cells + 2 polar nuclei

    Similarity of P and Q: Both are haploid (n) / both are gametes / both produced by meiosis (initially).

    (10 marks — award marks for correct comparison points under each category)`,
      marks: 20,
    },

    // ─────────────────────────────────────────────
    // SECTION C — Answer this question [20 marks]
    // ─────────────────────────────────────────────

    {
      subject: 'BIOLOGY',
      form: 'FORM_4',
      year: 2023,
      questionNo: 'P2-C-Q11',
      question: `(a) Diagram 11.1 shows a part of the human digestive system. There are two types of digestion that occur in Organ X (the mouth/buccal cavity).
    Explain how food is digested in the organ. [3 marks]

(b) Diagram 11.2 shows an obesity surgery package (Pakej Pembedahan Obesiti) offered by a hospital at RM33,499, involving surgery on certain organs in the digestive system.
    (i)  Justify the advantages and disadvantages of the method in Diagram 11.2. [6 marks]
    (ii) Suggest other methods to overcome obesity without going through surgery. [7 marks]

(c) The following information shows three poor eating habits:
    - Taking steroids and supplements to build muscles
    - Avoiding eating (starvation)
    - Vomiting out the food eaten
    Suggest how you can help individuals who have these poor eating habits. [4 marks]`,
      markingScheme: `(a) Organ X = Mouth (buccal cavity). Two types of digestion:

    Physical/Mechanical digestion:
    - Teeth bite and chew food into smaller pieces, increasing surface area for enzyme action.
    - Tongue rolls food into a bolus and mixes it with saliva.

    Chemical digestion:
    - Salivary glands secrete saliva containing salivary amylase (ptyalin).
    - Salivary amylase (optimum pH ~7 / neutral) breaks down starch (polysaccharide) into maltose (disaccharide).
    - Digestion continues until food moves to the stomach where acid deactivates salivary amylase.
    (3 marks — 1 for physical digestion, 1 for enzyme named, 1 for substrate → product)

(b)(i) Advantages of obesity surgery (Pakej Pembedahan Obesiti):
    1. Rapid and significant weight loss achieved in a short period.
    2. Reduces risk of obesity-related diseases: type 2 diabetes, hypertension, heart disease, sleep apnoea.
    3. Improves quality of life, mobility, and self-esteem.
    4. Long-lasting results if combined with lifestyle changes.
    5. Can treat severe/morbid obesity that does not respond to other methods.

    Disadvantages:
    1. Very high cost (RM33,499) — not affordable for most people / financial burden.
    2. Surgical risks: infection, internal bleeding, anaesthesia complications, organ damage.
    3. Nutritional deficiencies (vitamins, minerals) due to reduced food absorption post-surgery.
    4. Requires strict lifelong dietary changes and follow-up.
    5. Possible psychological effects / body image issues.
    6. Not suitable for all patients (requires medical evaluation).
    (6 marks — 3 advantages × 1 mark + 3 disadvantages × 1 mark, or equivalent)

(b)(ii) Other methods to overcome obesity without surgery:
    1. Balanced diet: Reduce total calorie intake; eat more vegetables, fruits, whole grains; limit high-fat, high-sugar processed foods.
    2. Regular physical exercise: Aerobic exercise (jogging, swimming, cycling) burns excess fat and calories; at least 30 minutes/day.
    3. Behavioural therapy / counselling: Address emotional eating habits, stress eating, and build healthy long-term eating behaviours.
    4. Medical treatment: Doctor-prescribed weight loss medications (e.g. appetite suppressants) under medical supervision.
    5. Nutritionist / dietitian consultation: Personalised meal planning and calorie-controlled diet programs.
    6. Increase daily physical activity: Take stairs instead of lifts, walk or cycle instead of driving.
    7. Support groups / community programs: Group accountability and motivation for sustained lifestyle changes.
    (7 marks — 1 mark per valid method with brief explanation)

(c) Ways to help individuals with poor eating habits:
    1. Provide education and counselling on the importance of balanced nutrition and the health consequences of poor eating habits (e.g. organ damage from steroids, malnutrition from starvation, electrolyte imbalance from purging).
    2. Encourage seeking professional help — refer to a doctor, nutritionist, or psychologist/counsellor who specialises in eating disorders.
    3. Provide emotional support and a non-judgmental environment — listen, understand, and motivate the person to change gradually.
    4. Promote healthy eating awareness through school / community / social media campaigns to change attitudes toward food and body image.
    (4 marks — 1 mark per valid suggestion)`,
      marks: 20,
    },
  ];

  console.log(`Seeding ${questions.length} Biology P2 2023 questions...`);

  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
  }

  console.log(`✅ Done! Seeded ${questions.length} Biology 2023 P2 questions.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());