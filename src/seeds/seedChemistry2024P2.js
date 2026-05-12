const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.pastYearQuestion.deleteMany({
    where: { subject: 'CHEMISTRY', year: 2024, questionNo: { startsWith: 'P2' } },
  });
  console.log('Cleared existing Chemistry P2 2024 records.');

  const questions = [
    // ─────────────────────────────────────────────
    // SECTION A — Answer ALL [60 marks]
    // ─────────────────────────────────────────────

    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P2-A-Q1',
      question: `Table 1 shows the atomic radius (nm) and proton number for Period 3 elements:
Na(0.186), Mg(0.160), Al(0.143), Si(0.118), P(0.110), S(0.104), Cl(0.100), Ar(0.094)
Proton numbers: Na=11, Mg=12, Al=13, Si=14, P=15, S=16, Cl=17, Ar=18

(a) State the meaning of period. [1 mark]

(b) Based on Table 1, give ONE reason why these elements are located in Period 3. [1 mark]

(c) (i)  State ONE use of argon, Ar in daily life. [1 mark]
    (ii) State the type of particles that exist in argon, Ar. [1 mark]

(d) State the change of the atomic radius of elements in Period 3 from sodium, Na to argon, Ar. [1 mark]`,
      markingScheme: `(a) A period is a horizontal row in the Periodic Table of Elements. Elements in the same period have the same number of electron shells / same number of occupied energy levels.

(b) These elements have the same number of electron shells = 3 / all have 3 occupied electron shells. (e.g. Na: 2.8.1; Ar: 2.8.8 — all have 3 shells)

(c)(i) Any ONE of: filling light bulbs / fluorescent lamps / used as inert atmosphere in welding / used in MRI machines / used in double-glazed windows

(c)(ii) Atoms only (no ions or molecules — argon is a noble gas, exists as individual atoms / monoatomic)

(d) The atomic radius decreases from Na to Ar. (From 0.186 nm to 0.094 nm — as proton number increases, nuclear charge increases, attracting electrons more strongly, reducing atomic radius)`,
      marks: 5,
    },

    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P2-A-Q2',
      question: `Table 2 shows information related to proton number, number of neutrons and number of electrons for atom X and ion X. X is not the actual symbol of the element.

               Atom X    Ion X
Proton number:   12        12
Neutrons:        12        12
Electrons:       12        10

(a) (i)  State the meaning of proton number. [1 mark]
    (ii) State the subatomic particles found in the nucleus of an atom. [2 marks]

(b) (i)  Write the electron arrangement of atom X. [1 mark]
    (ii) Write the formula of ion X. [1 mark]`,
      markingScheme: `(a)(i) Proton number is the number of protons in the nucleus of an atom. (It is also equal to the number of electrons in a neutral atom and determines the identity of the element.)

(a)(ii) Protons and neutrons (2 marks — 1 each)

(b)(i) 2.8.2 (Atom X has 12 electrons arranged in 3 shells)

(b)(ii) X²⁺ (Ion X has 12 protons but only 10 electrons → lost 2 electrons → charge = 2+)`,
      marks: 5,
    },

    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P2-A-Q3',
      question: `Diagram 1 shows a Magnetic Resonance Imaging (MRI) machine used to help diagnosing diseases. One of the main components in the machine is a superconductor.

(a) (i)   State the name of the superconductor used in the MRI machine. [1 mark]
    (ii)  State the function of the superconductor. [1 mark]
    (iii) Give ONE property of the superconductor. [1 mark]

(b) Siti poured cold water into a hot glass pot. The glass pot suddenly cracked. In order to overcome the problem, suggest ONE suitable type of glass in the manufacturing of the pot. Explain your answer. [3 marks]`,
      markingScheme: `(a)(i) Yttrium barium copper oxide (YBCO) / Niobium-titanium alloy / any acceptable superconducting material used in MRI

(a)(ii) To generate a strong magnetic field / to produce powerful electromagnets for imaging / to create the magnetic field needed for MRI scanning

(a)(iii) Has zero/no electrical resistance at very low temperatures (below critical temperature) / conducts electricity with no energy loss at low temperatures

(b) Suggested glass: Borosilicate glass (Pyrex glass)
Reason 1: Borosilicate glass has a very low coefficient of thermal expansion.
Reason 2: It can withstand sudden temperature changes (thermal shock) without cracking.
Reason 3: Because it expands and contracts very little when heated or cooled rapidly, preventing cracking when cold water is poured into a hot pot.
(3 marks — 1 for naming borosilicate/Pyrex glass, 2 for explanation)`,
      marks: 6,
    },

    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P2-A-Q4',
      question: `Diagram 2 shows an experiment to determine the heat of displacement for the reaction between copper(II) sulphate solution and magnesium metal.
Before reaction: 50 cm³ of 0.2 mol dm⁻³ CuSO4 solution, initial temperature = 27.5°C
After reaction: brown solid formed, highest temperature = 38.0°C
[Specific heat capacity of solution: 4.2 Jg⁻¹°C⁻¹; density of solution: 1 gcm⁻³]

(a) (i)  State the colour of copper(II) sulphate solution. [1 mark]
    (ii) State the colour change of copper(II) sulphate solution at the end of the experiment. Give ONE reason. [2 marks]

(b) Calculate the heat of displacement in the experiment. [3 marks]

(c) The experiment is repeated by replacing magnesium with zinc.
    Predict the temperature change in the reaction. [1 mark]`,
      markingScheme: `(a)(i) Blue

(a)(ii) Blue colour fades / becomes colourless / lighter blue.
Reason: Copper(II) ions (Cu²⁺) are removed from solution as they are reduced to copper metal (Cu) and deposited as brown solid. The concentration of Cu²⁺ ions decreases, causing the blue colour to fade.
(1 mark colour change + 1 mark reason)

(b) Heat of displacement calculation:
    Mass of solution = volume × density = 50 cm³ × 1 gcm⁻³ = 50 g
    Temperature change (ΔT) = 38.0 - 27.5 = 10.5°C
    Heat released (Q) = mcΔT = 50 × 4.2 × 10.5 = 2205 J = 2.205 kJ

    Moles of CuSO4 = (50/1000) × 0.2 = 0.01 mol
    Heat of displacement per mole = 2.205 / 0.01 = 220.5 kJ mol⁻¹

    Answer: Heat of displacement = -220.5 kJ mol⁻¹ (exothermic, negative sign)
    (3 marks — 1 for Q calculation, 1 for moles, 1 for final answer with unit)

(c) The temperature change will be smaller / lower than with magnesium.
    Reason: Zinc is lower than magnesium in the reactivity series / less reactive than magnesium → less energy released per mole in the displacement reaction.`,
      marks: 7,
    },

    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P2-A-Q5',
      question: `Table 3 shows the structural formulae and boiling points for chlorine (Cl2, bp = -34.0°C) and ethanol (C2H5OH, bp = 78.0°C).

(a) (i)   State the type of bond in chlorine molecule. [1 mark]
    (ii)  State how the bond in 5(a)(i) is formed. [1 mark]
    (iii) Based on Table 3, explain the difference in boiling points between chlorine and ethanol. [2 marks]

(b) Diagram 3 shows a biodegradable plastic bag made of cellulose that is difficult to be opened by a consumer.
    Based on your knowledge about chemical bond, suggest how the consumer can overcome the problem. Give ONE reason. [2 marks]

(c) Ammonium ion is formed through a dative bond between hydrogen ion, H⁺ with nitrogen atom, N in the ammonia molecule, NH3.
    Draw ammonium ion and label the dative bond. [2 marks]`,
      markingScheme: `(a)(i) Covalent bond (non-polar covalent bond / single covalent bond)

(a)(ii) Two chlorine atoms each share one electron to form a shared pair of electrons / each Cl atom contributes 1 electron to form a shared pair between the two Cl atoms.

(a)(iii) Chlorine (Cl2) has a very low boiling point (-34°C) because it has weak van der Waals forces / instantaneous dipole-induced dipole forces between molecules — little energy needed to overcome them.
Ethanol (C2H5OH) has a much higher boiling point (78°C) because it forms hydrogen bonds between molecules (O-H...O) — stronger intermolecular forces that require more energy to break.
(2 marks — 1 for Cl2 explanation, 1 for ethanol explanation)

(b) Suggestion: Wet/dampen the bag with water (moisten it).
Reason: Cellulose contains many -OH groups that form hydrogen bonds with each other, making the bag stiff and hard to open. Water molecules can form hydrogen bonds with the -OH groups of cellulose, breaking the hydrogen bonds between cellulose chains, making the bag softer and easier to open.
(2 marks — 1 for suggestion, 1 for reason)

(c) Ammonium ion NH4⁺ structure:
    - Draw N atom bonded to 4 H atoms (tetrahedral structure)
    - Overall charge 1+
    - One bond labelled as "dative bond" or "coordinate bond" (the bond formed when N donates a lone pair to H⁺)
    - N: [H3N→H]⁺ with arrow showing dative bond from N to H
    (2 marks — 1 for correct structure with 4 N-H bonds and charge, 1 for dative bond correctly labelled)`,
      marks: 8,
    },

    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P2-A-Q6',
      question: `Diagram 4 shows a flow chart of the conversion of carbon compound:
Alcohol X → [Reaction I] → Ethanoic acid (CH3COOH)
Alcohol X → [Reaction II] → Compound Y

(a) Write the general formula for alcohol. [1 mark]

(b) State the name of alcohol X. [1 mark]

(c) State the name of Reaction I and Reaction II. [2 marks]

(d) State the name of compound Y produced. [1 mark]

(e) (i)  Write the chemical equation for the formation of ethanoic acid through Reaction I. [2 marks]
    (ii) 0.3 mol of alcohol X is needed to produce ethanoic acid in Reaction I.
         Calculate the mass of ethanoic acid produced.
         [Relative atomic mass: H = 1, C = 12, O = 16] [2 marks]`,
      markingScheme: `(a) CnH(2n+1)OH or CnH(2n+2)O (general formula for alcohol, n ≥ 1)

(b) Ethanol (C2H5OH) — since it produces ethanoic acid (CH3COOH) via oxidation, the alcohol must be ethanol.

(c) Reaction I: Oxidation (alcohol oxidised to carboxylic acid using acidified potassium manganate(VII) or acidified potassium dichromate(VI))
    Reaction II: Esterification (alcohol reacts with carboxylic acid to form ester) / Dehydration

(d) Compound Y: Ester (ethyl ethanoate, CH3COOC2H5) if Reaction II is esterification with ethanoic acid.
    OR: Ethene (C2H4) if Reaction II is dehydration of ethanol.

(e)(i) Chemical equation for oxidation of ethanol to ethanoic acid:
    C2H5OH + 2[O] → CH3COOH + H2O
    OR: C2H5OH → CH3COOH (simplified)
    With oxidising agent: C2H5OH + acidified K2Cr2O7 → CH3COOH + H2O
    (2 marks — 1 for correct reactants/products, 1 for balanced equation)

(e)(ii) Molar mass of ethanoic acid (CH3COOH) = (2×12) + (4×1) + (2×16) = 24 + 4 + 32 = 60 g mol⁻¹
    From equation: 1 mol ethanol → 1 mol ethanoic acid
    0.3 mol alcohol X → 0.3 mol ethanoic acid
    Mass = 0.3 × 60 = 18 g
    (2 marks — 1 for molar mass calculation, 1 for final answer)`,
      marks: 9,
    },

    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P2-A-Q7',
      question: `Diagram 5 shows a type of food packaging made of polystyrene polymer. The structural formula shown is the monomer for polystyrene (styrene: C6H5-CH=CH2).
Based on Diagram 5,
(a) (i)   State the type of polymerisation reaction for the formation of polystyrene. [1 mark]
    (ii)  State ONE other use of polystyrene. [1 mark]
    (iii) Write the equation of polymerisation reaction for the formation of polystyrene. [2 marks]
    (iv)  Calculate the relative molecular mass of the monomer.
          [Relative atomic mass: H = 1, C = 12] [1 mark]

(b) Table 4 shows the chemical substances used as additives in manufacturing of jam and lipstick.
    Additives X (preservatives in jam: benzoic acid, sodium nitrite, sulphur dioxide; preservatives in lipstick: paraben, benzyl benzoate, formaldehyde)
    Additives Y (emulsifiers in jam: monoglycerides, diglycerides, lecithin; emulsifiers in lipstick: stearic acid, polyglyceryl, lanolin)
    Thickener in jam: starch, gelatin, acacia gum; Thickener in lipstick: Z
    (i)  Identify the types of additives X and Y. [2 marks]
    (ii) State ONE example of chemical substance Z. [1 mark]

(c) Nowadays, cosmetic products that did not go through pharmaceutical testing and did not obtain approval from the Ministry of Health of Malaysia have become abundant in the market, but those products still received great response from consumers.
    Is the situation justifiable? Give ONE reason. [2 marks]`,
      markingScheme: `(a)(i) Addition polymerisation

(a)(ii) Any ONE of: thermal insulation material / packaging material (styrofoam cups) / disposable cutlery / model-making material / ceiling tiles / flotation devices

(a)(iii) n(C6H5-CH=CH2) → [-CH(C6H5)-CH2-]n
         n molecules of styrene (with C=C double bond) → polystyrene polymer chain
         (2 marks — 1 for correct monomer structure with C=C, 1 for correct polymer repeating unit)

(a)(iv) Monomer = styrene = C8H8 (C6H5-CH=CH2)
        Mr = (8 × 12) + (8 × 1) = 96 + 8 = 104
        Answer: Mr = 104

(b)(i) X: Preservative (pengawet) — prevents spoilage/growth of microorganisms
       Y: Emulsifier (pengemulsi) — helps form homogeneous mixture of water and oil

(b)(ii) Z is a thickener for lipstick. Example: Beeswax / carnauba wax / candelilla wax / any acceptable thickening agent used in lipstick

(c) Not justifiable.
Reason: Unapproved cosmetics have not been tested for safety — they may contain harmful substances that could cause skin irritation, allergic reactions, or long-term health damage. Consumers may be unaware of the risks. The Ministry of Health approval ensures the product is safe for use.
(2 marks — 1 for clear stand "not justifiable", 1 for valid reason)`,
      marks: 10,
    },

    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P2-A-Q8',
      question: `(a) Table 5 shows the concentration and pH values for acid HA and acid HB:
    HA: concentration 0.1 mol dm⁻³, pH = 1
    HB: concentration 0.1 mol dm⁻³, pH = 5
    Based on Table 5,
    (i)   State the meaning of pH value. [1 mark]
    (ii)  Explain why acid HB has a higher pH value than acid HA. [1 mark]
    (iii) 50 cm³ of 0.1 mol dm⁻³ solution of acid HA reacts with excess magnesium powder.
          Chemical equation: 2HA + Mg → MgA2 + H2
          Calculate the volume of hydrogen gas produced.
          [Molar volume of gas at room conditions = 24 dm³ mol⁻¹] [3 marks]

(b) Diagram 6 shows production of two alkaline solutions X and Y. Solution alkali X is produced when solid X is dissolved in water; solution alkali Y is produced when gas Y is dissolved in water. Diagram shows ion W and OH⁻ ions in X, and molecule Y, ion Z and OH⁻ in Y.
    Explain the difference in the strength of alkalis for solution X and solution Y. [2 marks]

(c) A farmer's finger has been stung by a bee. The farmer applied substance R on the area stung but the swelling and pain did not subside.
    Suggest ONE suitable substance to replace substance R and state the steps of treatment to reduce pain using the concept of neutralisation. [3 marks]`,
      markingScheme: `(a)(i) pH value is a measure of the acidity or alkalinity of a solution / a scale from 0-14 that measures the concentration of hydrogen ions (H⁺) in a solution. Lower pH = more acidic = higher [H⁺].

(a)(ii) Both acids have the same concentration (0.1 mol dm⁻³) but HB has higher pH (less acidic) than HA.
HB is a weak acid — it partially/incompletely ionises in water → lower [H⁺] concentration → higher pH.
HA is a strong acid — it completely ionises → higher [H⁺] → lower pH of 1.
(1 mark — must mention partial ionisation / weak acid vs strong acid)

(a)(iii) Moles of HA = (50/1000) × 0.1 = 0.005 mol
From equation: 2 mol HA → 1 mol H2
Moles of H2 = 0.005 / 2 = 0.0025 mol
Volume of H2 = 0.0025 × 24 = 0.06 dm³ = 60 cm³
(3 marks — 1 for moles of HA, 1 for moles of H2, 1 for volume)

(b) Solution X (solid dissolved in water — e.g. NaOH): Strong alkali — completely dissociates in water, producing a high concentration of OH⁻ ions. All W⁺ ions and OH⁻ ions are fully dissociated.
Solution Y (gas dissolved in water — e.g. NH3): Weak alkali — partially/incompletely ionises in water, producing fewer OH⁻ ions. Molecule Y remains mostly undissociated — lower [OH⁻] → weaker alkali.
(2 marks — 1 for X strong/complete dissociation, 1 for Y weak/partial ionisation)

(c) Bee sting is acidic (formic acid / methanoic acid). Substance R may be an acidic substance (wrong — makes it worse).
Suitable replacement substance: Baking soda solution (sodium bicarbonate, NaHCO3) / dilute sodium hydroxide / calamine lotion (slightly alkaline substance).
Steps of treatment using neutralisation:
1. Clean the stung area with water.
2. Apply baking soda solution (alkaline) onto the stung area.
3. The alkali neutralises the acidic bee venom: acid + alkali → salt + water.
4. This reduces the acidity, reducing swelling and pain.
(3 marks — 1 for correct alkaline substance, 2 for correct neutralisation steps)`,
      marks: 10,
    },

    // ─────────────────────────────────────────────
    // SECTION B — Answer ONE question [20 marks]
    // ─────────────────────────────────────────────

    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P2-B-Q9',
      question: `(a) Diagram 7 shows a graph of volume of carbon dioxide gas collected against time for the reaction between calcium carbonate powder and dilute hydrochloric acid. The graph is a typical rate of reaction curve levelling off at ~50 cm³ at around 270 seconds.

    (i)  State the meaning of rate of reaction and write the chemical equation for the reaction. [3 marks]
    (ii) Based on the graph in Diagram 7, determine:
         - the average rate of reaction in the third minute
         - the overall average rate of reaction [4 marks]

(b) Table 6 shows information about the reaction between zinc and nitric acid:
    Experiment I:   2g zinc + 50 cm³ of 0.1 mol dm⁻³ nitric acid → 120s to collect 20 cm³ gas
    Experiment II:  2g zinc + 50 cm³ of 0.05 mol dm⁻³ nitric acid → 180s to collect 20 cm³ gas
    Experiment III: 2g zinc + 50 cm³ of 0.05 mol dm⁻³ nitric acid + copper(II) sulphate solution → 80s to collect 20 cm³ gas

    (i)  Compare the rate of reaction between experiments I and II, and between II and III. Explain your answer based on Collision Theory. [10 marks]
    (ii) Experiment I is repeated by replacing nitric acid with a strong diprotic acid of the same concentration.
         State what will happen to the rate of reaction and give ONE reason. Suggest ONE name for the strong diprotic acid. [3 marks]`,
      markingScheme: `(a)(i) Rate of reaction = the change in quantity (volume/mass/concentration) of reactant or product per unit time.
Chemical equation: CaCO3(s) + 2HCl(aq) → CaCl2(aq) + H2O(l) + CO2(g)
(3 marks — 1 for definition, 1 for correct equation, 1 for state symbols)

(a)(ii) Average rate in 3rd minute (t = 120s to 180s):
Read volume at t=120s and t=180s from graph.
Average rate = ΔVolume / ΔTime = (V180 - V120) / 60 seconds
(Values depend on graph reading — typically ~(38-28)/60 = ~0.17 cm³s⁻¹)

Overall average rate = Total volume / Total time = ~50 cm³ / ~270s ≈ 0.185 cm³s⁻¹
(4 marks — 2 for 3rd minute rate with working, 2 for overall average rate with working)

(b)(i) Comparison I vs II:
Experiment I is faster than Experiment II (120s < 180s to collect same volume).
Collision Theory explanation:
- Experiment I uses higher concentration of nitric acid (0.1 mol dm⁻³) vs Experiment II (0.05 mol dm⁻³).
- Higher concentration → more H⁺ ions and NO3⁻ ions per unit volume.
- More reactant particles in the same volume → more frequent collisions between zinc and acid ions.
- More effective collisions per unit time → higher rate of reaction in Experiment I.

Comparison II vs III:
Experiment III is faster than Experiment II (80s < 180s).
Both use same concentration (0.05 mol dm⁻³) and same amount of zinc.
- Experiment III includes copper(II) sulphate solution → Cu²⁺ ions displaced by zinc → copper deposits on zinc surface.
- This creates a zinc-copper galvanic cell (electrochemical cell).
- Acts as a catalyst — provides alternative reaction pathway with lower activation energy.
- Lower activation energy → more collisions have energy ≥ activation energy.
- More effective collisions per unit time → higher rate in Experiment III.
(10 marks — 5 marks per comparison: 1 for correct rate comparison, 2 for reason with collision theory, 2 for explanation of factor)

(b)(ii) Rate of reaction will INCREASE.
Reason: A strong diprotic acid (e.g. H2SO4) at the same concentration produces 2 mol of H⁺ per mole of acid → higher [H⁺] than 1 mol dm⁻³ HNO3 → more H⁺ ions per unit volume → more frequent effective collisions → higher rate of reaction.
Suggested strong diprotic acid: Sulphuric acid (H2SO4)
(3 marks — 1 for rate increases, 1 for reason, 1 for acid name)`,
      marks: 20,
    },

    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P2-B-Q10',
      question: `(a) Diagram 8.1 shows the apparatus for the displacement reaction between zinc metal and copper(II) nitrate, Cu(NO3)2 solution. Displacement reaction is an example of a redox reaction.
    Chemical equation: Zn + Cu(NO3)2 → Zn(NO3)2 + Cu

    What is meant by redox reaction? Determine the oxidising agent, the reducing agent and state the colour of copper(II) nitrate, Cu(NO3)2 solution. [4 marks]

(b) Diagram 8.2 shows a chemical cell with magnesium electrode in 1.0 mol dm⁻³ Mg²⁺ solution, and chlorine gas (1 atm) with platinum electrode in 1.0 mol dm⁻³ Cl⁻ solution. Salt bridge connects the two half-cells.
    Standard electrode potentials:
    Mg²⁺ + 2e⁻ ⇌ Mg   E° = -2.38 V
    Cl2 + 2e⁻ ⇌ 2Cl⁻  E° = +1.36 V

    Based on Diagram 8.2 and Table 7:
    - Identify the negative terminal and the positive terminal.
    - Write the overall ionic equation and cell notation for the chemical cell. [6 marks]

(c) Diagram 8.3 shows three sets of experiments for electrolysis of copper(II) chloride solution (0.001 mol dm⁻³) using different anodes:
    Set I: Carbon anode
    Set II: Copper anode
    Set III: Iron ring anode

    (i)   List all ions present in copper(II) chloride solution. [2 marks]
    (ii)  Write the half equation at the anode for Set I and Set III. Compare the observation of colour of solutions in Set I and Set III. [4 marks]
    (iii) State the products formed at the anode for Set I, Set II and Set III. If the concentration of copper(II) chloride solution in Set I is changed to 1.0 mol dm⁻³, state the product formed at the anode. [4 marks + extra]`,
      markingScheme: `(a) Redox reaction: A reaction that involves both oxidation and reduction occurring simultaneously. Oxidation (loss of electrons) and reduction (gain of electrons) happen at the same time.

From Zn + Cu(NO3)2 → Zn(NO3)2 + Cu:
- Zn → Zn²⁺ + 2e⁻ (oxidation) → Zn is the reducing agent (causes reduction of Cu²⁺)
- Cu²⁺ + 2e⁻ → Cu (reduction) → Cu²⁺/Cu(NO3)2 is the oxidising agent (causes oxidation of Zn)

Oxidising agent: Cu(NO3)2 / Cu²⁺ ions
Reducing agent: Zinc (Zn)
Colour of Cu(NO3)2 solution: Blue
(4 marks — 1 for redox definition, 1 for oxidising agent, 1 for reducing agent, 1 for colour)

(b) Identifying terminals:
Mg has lower E° (-2.38V) → more negative → undergoes oxidation → negative terminal (anode)
Cl2 electrode has higher E° (+1.36V) → undergoes reduction → positive terminal (cathode)

Negative terminal: Magnesium electrode
Positive terminal: Platinum/Chlorine electrode

E°cell = E°cathode - E°anode = +1.36 - (-2.38) = +3.74 V

Half equations:
Anode (oxidation): Mg → Mg²⁺ + 2e⁻
Cathode (reduction): Cl2 + 2e⁻ → 2Cl⁻

Overall ionic equation: Mg + Cl2 → Mg²⁺ + 2Cl⁻

Cell notation: Mg(s) | Mg²⁺(aq) || Cl⁻(aq) | Cl2(g) | Pt(s)
(6 marks — 1 each for negative terminal, positive terminal, E° cell, half equation anode, half equation cathode, cell notation)

(c)(i) Ions present in Cu(II) chloride (CuCl2) solution:
- Cu²⁺ ions (copper(II) ions)
- Cl⁻ ions (chloride ions)
- H⁺ ions (from water)
- OH⁻ ions (from water)
(2 marks — 1 for Cu²⁺ and Cl⁻, 1 for H⁺ and OH⁻)

(c)(ii) Set I (Carbon anode — inert, dilute CuCl2 0.001 mol dm⁻³):
At very low concentration, OH⁻ is selectively discharged (despite Cl⁻ being present, concentration is too low):
Half equation: 4OH⁻ → 2H2O + O2 + 4e⁻ (oxygen gas produced)

Set III (Iron ring anode — active anode):
Iron ring itself is oxidised:
Half equation: Fe → Fe²⁺ + 2e⁻ (iron dissolves)

Colour comparison:
Set I: Solution remains blue / no significant colour change (oxygen gas produced, Cu²⁺ not affected much)
Set III: Solution becomes pale green / greenish (Fe²⁺ ions formed from iron ring dissolving, iron(II) ions give pale green colour)
(4 marks — 1 each for Set I half eq, Set III half eq, Set I colour, Set III colour)

(c)(iii) Products at anode:
Set I (Carbon, 0.001 mol dm⁻³ — dilute): Oxygen gas (O2) — OH⁻ selectively discharged at low [Cl⁻]
Set II (Copper anode — active): Copper electrode itself dissolves / copper ions (Cu²⁺) released into solution
Set III (Iron ring — active): Iron ring dissolves / Fe²⁺ ions produced

If concentration in Set I changed to 1.0 mol dm⁻³ (concentrated):
Product at anode: Chlorine gas (Cl2) — at high [Cl⁻], chloride ions are selectively discharged instead of OH⁻
(4 marks — 1 each for Set I, Set II, Set III products, 1 for high concentration answer)`,
      marks: 20,
    },

    // ─────────────────────────────────────────────
    // SECTION C — Must answer [20 marks]
    // ─────────────────────────────────────────────

    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P2-C-Q11',
      question: `(a) Diagram 9.1 shows an advertisement by a construction company "Window World" promoting Smart Window Film — photochromic glass windows that reduce UV ray exposure.
    Based on Diagram 9.1, what are the substances used in the glass windows that could reduce the UV rays? Explain how the substances work. [3 marks]

(b) Table 8 shows the comparison of properties for three types of composite materials and their uses:
    Composite A: high compression strength, corrosion resistant, high stretching strength → used for bridge, building
    Composite B: high stretching strength, corrosion resistant and durable, heat and electrical insulator → used for helmet, car bumper
    Composite C: high compression strength, flexible → used for computer network cables, video camera

    Based on Table 8, state the type of composite materials A, B and C. Choose ONE of the composite materials and state the original components of the material. [5 marks]

(c) Hard water contains calcium ions, Ca²⁺ and magnesium ions, Mg²⁺.
    Diagram 9.2 shows the products of reactions between cleaning agent A and cleaning agent B with calcium ions:
    Cleaning agent A (soap): 2CH3(CH2)16COO⁻ + Ca²⁺ → [CH3(CH2)16COO]2Ca (precipitate in hard water / soluble in soft water)
    Cleaning agent B (detergent): 2ROSO3⁻ + Ca²⁺ → (ROSO3)2Ca (soluble in both hard and soft water)

    Choose a more effective cleaning agent to wash clothes in hard water and explain your answer. [4 marks]

(d) "Alam Flora aims to collect 500 tonnes of used cooking oil." (Sinar Harian)
    Used cooking oil can be processed for the manufacturing of soap to earn income.
    Suggest ONE alkali that can be used to produce soap bar. Describe the method to produce the soap by using the alkali with used cooking oil. [8 marks]`,
      markingScheme: `(a) Substance in photochromic glass: Silver halide crystals (silver chloride, AgCl / silver bromide, AgBr) embedded in the glass.

How it works:
1. When UV rays (from sunlight) hit the glass, silver halide crystals absorb UV energy.
2. The UV energy causes silver ions (Ag⁺) to be reduced to silver metal atoms (Ag): AgCl → Ag + Cl (photochemical reaction).
3. The tiny silver atoms cluster together and darken the glass, blocking/reducing UV transmission.
4. When UV light is removed (indoors/shade), the reaction reverses — silver atoms re-oxidise to Ag⁺, glass becomes clear again.
(3 marks — 1 for naming silver halide, 2 for explanation of how it works)

(b) Type of composite materials:
A: Reinforced concrete (concrete + steel rods) — high compression + stretching strength, corrosion resistant for buildings/bridges
B: Fibre-reinforced polymer / GFRP / carbon fibre composite — high stretching strength, heat insulator, used for helmets/car bumpers
C: Optical fibre composite / fibre optic — high compression strength, flexible, used for computer cables/video cameras

Choose ONE (example: Composite A — Reinforced concrete):
Original components:
1. Concrete (cement + sand + gravel/aggregate) — provides high compression strength
2. Steel rods/rebars — provides high tensile/stretching strength
Together they form reinforced concrete which combines the compressive strength of concrete with the tensile strength of steel.
(5 marks — 1 each for naming A, B, C correctly + 2 marks for chosen material with original components)

(c) More effective cleaning agent in hard water: Cleaning Agent B (detergent/synthetic detergent).

Explanation:
1. Cleaning agent A (soap) reacts with Ca²⁺ in hard water to form calcium stearate — an insoluble precipitate (scum). This wastes soap and leaves scum on clothes.
2. Cleaning agent B (detergent) reacts with Ca²⁺ to form (ROSO3)2Ca which is SOLUBLE in water — no precipitate/scum formed.
3. Detergent B remains effective in hard water as it does not form insoluble calcium salt.
4. Therefore detergent B can effectively clean clothes in hard water without being wasted as scum.
(4 marks — 1 for correct choice, 1 for soap forms insoluble precipitate, 1 for detergent forms soluble product, 1 for conclusion)

(d) Suggested alkali: Sodium hydroxide (NaOH) — produces hard soap bar (sodium soap).
(Potassium hydroxide KOH produces soft/liquid soap — accept if candidate specifies soap bar requires NaOH)

Method to produce soap (saponification process):
1. Heat used cooking oil (triglycerides/vegetable fat) to remove water and impurities / filter to remove food residue.
2. Prepare concentrated NaOH solution (lye) in a heat-resistant container.
3. Slowly add the hot NaOH solution to the warm cooking oil while stirring continuously.
4. Heat the mixture gently and stir for 30-60 minutes — saponification reaction occurs:
   Fat/oil (triglyceride) + NaOH → Sodium soap (fatty acid salt) + Glycerol
5. Add saturated salt (NaCl) solution to the mixture — this causes the soap to precipitate/salt out from the glycerol layer (salting out process).
6. Soap floats to the surface — collect the soap layer (remove glycerol layer below).
7. Wash the soap with cold water to remove excess NaOH and glycerol.
8. Pour soap into moulds and allow to cool and harden.
9. Cut into bars when solidified.
(8 marks — 1 for alkali, 1 for saponification equation/description, 1 for heating method, 1 for salting out, 1 for separation, 1 for washing/purification, 1 for moulding, 1 for overall logical sequence)`,
      marks: 20,
    },
  ];

  console.log(`Seeding ${questions.length} Chemistry P2 2024 questions...`);

  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    console.log(`${q.questionNo} done`);
  }

  console.log(`✅ Done! Seeded ${questions.length} Chemistry 2024 P2 questions.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());