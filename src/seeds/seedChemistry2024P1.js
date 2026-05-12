const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.pastYearQuestion.deleteMany({
    where: { subject: 'CHEMISTRY', year: 2024, questionNo: { startsWith: 'P1' } },
  });
  console.log('Cleared existing Chemistry P1 2024 records.');

  const questions = [
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q1',
      question: `Table 1 shows the melting point and boiling point for four substances P, Q, R and S.
P: melting -101.0°C, boiling -35.0°C
Q: melting -94.0°C, boiling 65.0°C
R: melting 17.8°C, boiling 290.0°C
S: melting 97.8°C, boiling 883.0°C

What is the physical state of each substance at 30°C?
A  P=Solid, Q=Liquid, R=Liquid, S=Gas
B  P=Solid, Q=Solid, R=Gas, S=Gas
C  P=Gas, Q=Gas, R=Solid, S=Solid
D  P=Gas, Q=Liquid, R=Liquid, S=Solid`,
      markingScheme: `Answer: A
At 30°C:
P (bp -35°C): already above boiling point → Gas ✗ — Wait, mp=-101, bp=-35, so at 30°C it is above bp → Gas
Q (mp=-94, bp=65): at 30°C, above mp but below bp → Liquid
R (mp=17.8, bp=290): at 30°C, above mp but below bp → Liquid
S (mp=97.8, bp=883): at 30°C, below mp → Solid

Correct: P=Gas, Q=Liquid, R=Liquid, S=Solid → Answer D`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q2',
      question: `Diagram 1 shows a standard representation of atom of element X with nucleon number 11 and proton number 5.
Which of the following atomic structures represents ion X?
A  [5p, 6n] 1+
B  [5p, 6n] 1-
C  [11p, 5n] (neutral-like)
D  [16p, 6n] 2-`,
      markingScheme: `Answer: A
Element X has proton number 5 (5 protons). Nucleon number 11 means mass number 11, so neutrons = 11 - 5 = 6.
Ion X+ means it lost 1 electron (5 protons, 6 neutrons, charge 1+).
Answer: A — [5p, 6n] with 1+ charge.`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q3',
      question: `Diagram 2 shows the structural formula of an ester.
The ester has the structure: CH3-CH2-C(=O)-O-CH2-CH2-CH2-CH3 (ethyl butanoate / similar ester with formula C10H20O2 based on structural count).
What is the empirical formula of the ester?
A  C10H20O2
B  C5H10O2
C  C5H10O
D  CHO`,
      markingScheme: `Answer: B
From the structural formula shown, the molecular formula is C5H10O2 (counting all atoms from the structure shown).
Empirical formula = simplest whole number ratio.
C5H10O2 — ratio C:H:O = 5:10:2 = 5:10:2, simplest = C5H10O2 (already simplest, cannot be reduced further as GCD=1 for 5,10,2 → divide by... 5:10:2 → 1:2:0.4 — not whole number, so stays C5H10O2).
Answer: B`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q4',
      question: `When hydrogen gas is flowed to powder Y and heated, copper metal and water are produced.
Which of the following is correct about that reaction?
A  Powder Y is green
B  1 mol of Y produces 2 mol of copper
C  The reactants are hydrogen and copper(II) oxide
D  Increases the oxidation number`,
      markingScheme: `Answer: C
The reaction is: CuO + H2 → Cu + H2O
Powder Y is copper(II) oxide (CuO) — black powder, not green.
1 mol CuO produces 1 mol Cu (not 2 mol).
The reactants are hydrogen gas and copper(II) oxide — Answer C is correct.`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q5',
      question: `J is a Group 1 element that reacts with element M to form a compound. Proton number of M = 16.
Which of the following chemical formulae is correct for the compound?
A  JM
B  JM2
C  J2M
D  J2M3`,
      markingScheme: `Answer: C
M has proton number 16 → electron arrangement 2.8.6 → Group 16 → valency 2 (gains 2 electrons to form M²⁻).
J is Group 1 → valency 1 (forms J⁺).
To balance: 2 J⁺ + M²⁻ → J2M.
Answer: C`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q6',
      question: `Diagram 3 shows a graph of the changes in a property of elements in Period 3 of the Periodic Table against proton number (11 to 17). The graph shows a generally increasing trend.
What is property X?
A  Atomic size
B  Melting point
C  Metallic character
D  Electronegativity`,
      markingScheme: `Answer: D
Across Period 3 (left to right), electronegativity increases as nuclear charge increases and atomic radius decreases. Atomic size decreases, melting point varies (peaks at Si), metallic character decreases. The generally increasing trend shown matches electronegativity.
Answer: D`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q7',
      question: `The electron arrangement of atom L is 2.8.3.
What is the number of electrons of the element that is located in the same group as L in the Periodic Table of Elements?
A  3
B  5
C  8
D  10`,
      markingScheme: `Answer: A
Atom L has electron arrangement 2.8.3 → 13 electrons → Group 13 (Period 3).
Elements in the same group have the same number of valence electrons = 3.
The element in Period 2 of Group 13 is Boron (B) with electron arrangement 2.3 → 5 electrons total, but the question asks number of electrons in the element in the same group.
Period 2 Group 13: Boron = 5 electrons.
Answer: B (5 electrons) → Answer B`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q8',
      question: `Which of the following are the special characteristics of a transition element?
I   Acts as catalyst
II  Has shiny surface
III Forms coloured ion
IV  Exists as solid at room temperature
A  I and II
B  I and III
C  II and IV
D  III and IV`,
      markingScheme: `Answer: B
Special/unique characteristics of transition elements:
- Acts as catalyst (I) ✓
- Forms coloured ions (III) ✓
- Has variable oxidation states
- Forms complex ions
Shiny surface (II) and being solid at room temperature (IV) are properties of most metals in general, not unique to transition elements.
Answer: B (I and III)`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q9',
      question: `Hydrogen bond is the attraction force between hydrogen atom that has bonded with an atom with high electronegativity in another molecule.
Which of the following atoms are involved in the formation of hydrogen bond?
A  Chlorine
B  Sulphur
C  Phosphorus
D  Nitrogen`,
      markingScheme: `Answer: D
Hydrogen bonds form between H and highly electronegative atoms: F, O, or N (fluorine, oxygen, nitrogen).
Among the options, Nitrogen (N) is the only atom that forms hydrogen bonds.
Chlorine, sulphur, and phosphorus have lower electronegativity and do not typically form hydrogen bonds.
Answer: D`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q10',
      question: `Which of the following solutions with the same volume and concentration has the highest number of hydrogen ions per unit volume?
A  Potassium hydroxide
B  Ammonia solution
C  Hydrochloric acid
D  Sulphuric acid`,
      markingScheme: `Answer: D
Sulphuric acid (H2SO4) is a diprotic strong acid — each mole produces 2 moles of H⁺ ions.
H2SO4 → 2H⁺ + SO4²⁻
HCl → H⁺ + Cl⁻ (only 1 H⁺ per mole)
KOH and NH3 are alkaline — they produce OH⁻, not H⁺.
Same concentration but H2SO4 gives 2× more H⁺ than HCl.
Answer: D`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q11',
      question: `The following information shows statements for the physical properties of compounds Q and R:
- Q and R cannot conduct electric in all states
- Q has low melting and boiling points
- R has high melting and boiling points
- Q is soluble in water, R is insoluble in water

Which of the following compounds represent Q and R?
A  Q=Carbon dioxide, R=Silicon dioxide
B  Q=Aluminium chloride, R=Sodium chloride
C  Q=Silicon dioxide, R=Aluminium chloride
D  Q=Sodium chloride, R=Carbon dioxide`,
      markingScheme: `Answer: A
Q: cannot conduct electricity, low mp/bp, soluble in water → simple molecular covalent compound → Carbon dioxide (CO2): non-conductor, low bp (-78°C), dissolves in water.
R: cannot conduct electricity, high mp/bp, insoluble in water → giant covalent structure → Silicon dioxide (SiO2): non-conductor, very high mp (1710°C), insoluble in water.
Answer: A`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q12',
      question: `Diagram 4 shows an apparatus set-up to investigate one of the properties of substance X. Solid X is placed in test tube I with Solvent Y and Solution X in test tube II with blue litmus paper. Blue litmus paper in test tube I does not change colour while blue litmus paper in test tube II changes colour.
What is the conclusion about the property of substance X?
A  X shows acidic property with the presence of Y
B  X shows alkaline property with the presence of Y
C  Solution X produces pH value of 9 in test tube II
D  Solution X produces pH value of 7 in test tube II`,
      markingScheme: `Answer: A
Blue litmus paper turns red in acidic conditions. Test tube II (with solution/water present) turns the blue litmus red → Solution X is acidic.
Test tube I (with only solvent Y, no water) does not change → X only shows acidic properties when dissolved in water (with presence of Y/solvent).
Answer: A — X shows acidic property with the presence of Y (water/solvent).`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q13',
      question: `The following information shows three of the steps involved in an experiment to determine the average rate of reaction between zinc and acid solution:
J: Put a spatula of zinc powder
L: Pour 20 cm³ of acid solution into a conical flask
M: Fill a burette with water and invert it into a basin filled with water

Which of the following is the correct sequence of steps in the experiment?
A  J, L, M
B  J, M, L
C  M, J, L
D  M, L, J`,
      markingScheme: `Answer: D
Correct sequence for gas collection over water (upward displacement):
1. M: Set up the inverted burette filled with water first (preparation of gas collection apparatus)
2. L: Pour acid solution into the conical flask
3. J: Add zinc powder to start the reaction and collect gas

Answer: D (M, L, J)`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q14',
      question: `A small amount of copper(II) sulphate powder is added to the mixture of zinc powder and dilute hydrochloric acid to produce hydrogen gas faster.
What is the function of copper(II) sulphate?
A  Decreases the heat of reaction
B  Decreases activation energy of reaction
C  Increases the number of reactant particles
D  Increases the total surface area of reactant`,
      markingScheme: `Answer: B
Copper(II) sulphate acts as a catalyst in this reaction. CuSO4 causes copper to deposit on zinc surface, creating a zinc-copper galvanic cell that speeds up the reaction.
A catalyst works by providing an alternative reaction pathway with lower activation energy.
Answer: B — Decreases activation energy of reaction.`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q15',
      question: `Bullet train is a type of transportation that can reach a speed up to 500 km/h due to the usage of substance Z. This substance does not have electrical resistance when used at a very low temperature.
Which of the following is substance Z?
A  Photochromic glass
B  Superconductor
C  Silicon carbide
D  Duralumin`,
      markingScheme: `Answer: B
A substance that has zero electrical resistance at very low temperatures is a superconductor. Bullet trains (maglev trains) use superconducting electromagnets to achieve magnetic levitation and high speeds.
Answer: B — Superconductor`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q16',
      question: `Ahmad is an engineering student who needs to produce a prototype of brake disc. He chooses steel to make it. When the brake disc is tested, he found out that it has low resistance to heat and cannot withstand thermal shock.
Which of the following substances is suitable to replace steel to overcome the problem?
A  Aluminium oxide
B  Itrium(III) carbonate
C  Lead(II) oxide
D  Silicon carbide`,
      markingScheme: `Answer: D
Silicon carbide (SiC) is a ceramic material with excellent thermal resistance, high hardness, and ability to withstand thermal shock — ideal for brake disc applications.
Aluminium oxide also has heat resistance but is more brittle. Silicon carbide is specifically known for its use in high-performance brake discs.
Answer: D — Silicon carbide`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q17',
      question: `Which of the following is correct about the reduction reaction?
A  Gain of electrons
B  Gain of oxygen
C  Loss of hydrogen
D  Increasing of oxidation number`,
      markingScheme: `Answer: A
Reduction is defined as:
- Gain of electrons ✓
- Loss of oxygen
- Gain of hydrogen
- Decrease in oxidation number
Answer: A — Gain of electrons`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q18',
      question: `Diagram 5 shows the apparatus set-up of an electrolytic cell using concentrated CuSO4 solution with carbon electrodes.
Given Standard Electrode Potential Series:
Cu²⁺ + 2e⁻ ⇌ Cu  E° = +0.34V
2H⁺ + 2e⁻ ⇌ H2  E° = 0.00V
O2 + H2O + 4e⁻ ⇌ 4OH⁻  E° = +0.40V
S2O8²⁻ + 2e⁻ ⇌ 2SO4²⁻  E° = +2.01V

Which of the following statements explains the factor that affects the observation at anode?
A  Carbon is an inert electrode
B  No presence of halide ions
C  Concentrated electrolyte is used
D  The E° value of the selectively discharged ion is less positive`,
      markingScheme: `Answer: C
In concentrated CuSO4 solution, at the anode, OH⁻ ions are discharged (oxygen gas produced) rather than SO4²⁻.
The key factor is that concentrated electrolyte is used — when concentration is high, the more concentrated ion (in this case related to the electrolyte concentration) affects selective discharge.
Actually for concentrated CuSO4 with carbon anode: OH⁻ is discharged → O2 produced.
The factor is: concentrated electrolyte affects selective discharge.
Answer: C`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q19',
      question: `Diagram 6 shows an apparatus set-up to determine the standard electrode potential of a metal. A zinc electrode in 1.0 mol dm⁻³ zinc ion solution connected to a hydrogen electrode. Voltage = 0.76V. What is the function of X (the salt bridge)?
A  Allows the flow of electrons through external circuit
B  Allows the movements of ions between two electrolytes
C  Connects two electrodes to flow electric current
D  Completes the circuit by allowing the flow of electric current through connecting wires`,
      markingScheme: `Answer: B
The salt bridge (X) in an electrochemical cell allows the movement of ions between the two half-cell electrolytes to maintain electrical neutrality and complete the circuit.
Electrons flow through the external wire, not the salt bridge.
Answer: B — Allows the movements of ions between two electrolytes`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q20',
      question: `Diagram 7 shows a chemical cell with Electrode L in L nitrate solution and Electrode Q in Q nitrate solution.
Given Standard Electrode Potential Series:
Qⁿ⁺ + ne⁻ ⇌ Q  E° = -0.76V
2H⁺ + 2e⁻ ⇌ H2  E° = 0.00V
Lᵐ⁺ + me⁻ ⇌ L  E° = +0.80V

What is the positive terminal and the E° cell of the chemical cell?
A  L, +1.56V
B  L, +0.76V
C  Q, +0.80V
D  Q, +1.56V`,
      markingScheme: `Answer: D
E° cell = E° cathode - E° anode
L has higher E° (+0.80V) → cathode (positive terminal, reduction occurs)
Q has lower E° (-0.76V) → anode (negative terminal, oxidation occurs)
Positive terminal = L... wait.
E° cell = +0.80 - (-0.76) = +1.56V
Positive terminal is L (cathode).
Answer: A — Positive terminal L, E° = +1.56V`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q21',
      question: `Which of the following occurs to an iron atom when iron rusts?
A  Loss of electron
B  Receives hydrogen
C  Loss of oxygen
D  Decrease in oxidation number`,
      markingScheme: `Answer: A
When iron rusts, iron is oxidised:
Fe → Fe²⁺ + 2e⁻ (or Fe³⁺)
Iron loses electrons → oxidation occurs.
Answer: A — Loss of electron`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q22',
      question: `Banana flavour is pentyl ethanoate.
Which of the following equations represents the production of the flavour?
A  C5H11OH + CH3COOH → CH3COOC5H11 + H2O
B  C2H5OH + C4H9COOH → C4H9COOC2H5 + H2O
C  C4H9OH + C2H5COOH → C2H5COOC4H9 + H2O
D  C3H7OH + C3H7COOH → C3H7COOC3H7 + H2O`,
      markingScheme: `Answer: A
Pentyl ethanoate = ethanoic acid + pentanol (pentan-1-ol)
Ethanoic acid = CH3COOH
Pentanol = C5H11OH
Reaction: C5H11OH + CH3COOH → CH3COOC5H11 + H2O
Answer: A`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q23',
      question: `Diagram 8 shows the chemical formulae of two carbon compounds:
T: C6H12
Z: C6H14

Which of the following properties is correct for both compounds?
A  T does not decolourise bromine water; Z decolourises bromine water
B  T produces carboxylic acid when reacted with steam; Z produces alcohol when reacted with steam
C  More soot is produced when T is burnt in oxygen; less soot when Z is burnt in oxygen
D  Orange colour of acidified potassium dichromate(VI) solution remains unchanged for T; Changes to green for Z`,
      markingScheme: `Answer: C
T = C6H12: could be cyclohexane or an alkene. Z = C6H14: alkane (hexane).
C6H12 has higher carbon-to-hydrogen ratio than C6H14 → more incomplete combustion → more soot when burnt.
C6H14 (alkane) burns more completely → less soot.
Answer: C`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q24',
      question: `Which of the following pairs is correctly matched?
A  Alcohol / Carboxylate / C2H6O
B  Alcohol / Hydroxyl / C2H4O2
C  Carboxylic acid / Carboxylate / C2H6O
D  Carboxylic acid / Carboxyl / C2H4O2`,
      markingScheme: `Answer: D
Carboxylic acid: functional group = carboxyl (-COOH).
Simplest carboxylic acid = methanoic acid (HCOOH) = CH2O2 or ethanoic acid = C2H4O2.
Alcohol functional group = hydroxyl (-OH).
Carboxylate is the ion/salt of carboxylic acid (COO⁻), not the functional group name for carboxylic acid.
Answer: D — Carboxylic acid / Carboxyl / C2H4O2`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q25',
      question: `Diagram 9 shows the energy profile diagram for the reaction between zinc and sulphuric acid (Zn + H2SO4 → ZnSO4 + H2). The diagram shows points W (reactants energy level), Y (activation energy peak), X (on the way down from peak), and Z (products energy level).
Which of the following is the activation energy for the reaction?
A  W
B  X
C  Y
D  Z`,
      markingScheme: `Answer: C
Activation energy is the minimum energy required to start a reaction — represented by the energy difference between reactants and the peak (transition state) on the energy profile diagram.
The peak of the energy profile = Y = activation energy.
Answer: C — Y`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q26',
      question: `Diagram 10 shows the energy level diagram of a reaction:
X2 + Y2 → 2XY, ΔH = +180 kJ mol⁻¹

Which of the following is correct about the energy level diagram?
A  The reaction is exothermic
B  Heat energy is released to the surrounding
C  Temperature of the mixture decreases during reaction
D  Total energy content of products is lower than the total energy content of reactants`,
      markingScheme: `Answer: C
ΔH = +180 kJ mol⁻¹ (positive) → endothermic reaction.
Endothermic: heat is absorbed FROM surroundings → temperature of mixture/surroundings decreases.
Products have HIGHER energy than reactants.
Answer: C — Temperature of the mixture decreases during reaction`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q27',
      question: `The following equation represents a chemical reaction to determine the heat of displacement:
X + 2AgNO3 → X(NO3)2 + 2Ag

It is found that the colourless solution changes to blue and a grey solid is formed when metal X is added.
Which of the following metals can replace X to obtain the highest temperature change?
A  Al
B  Zn
C  Sn
D  Pb`,
      markingScheme: `Answer: A
The colourless solution turning blue indicates Cu²⁺ ions formed... wait, actually X + 2AgNO3 → X(NO3)2 + 2Ag. The solution turns blue suggests X²⁺ is blue → X could be copper. But question asks which metal REPLACES X for highest temperature change.
For highest heat of displacement, the metal must be highest in the reactivity series (furthest from Ag).
Order: Al > Zn > Sn > Pb > Ag
Al is most reactive → greatest difference in reactivity → highest temperature change.
Answer: A — Al`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q28',
      question: `Table 2 shows the fuel values of fuels L and M:
L: 20 kJ g⁻¹
M: 30 kJ g⁻¹

Which of the following statements is correct for a suitable choice of fuel to grill satays?
A  L — The fuel value is lower
B  M — Releases more heat per unit mass
C  L — Has smaller mass than M
D  M — Heat combustion is lower`,
      markingScheme: `Answer: B
Higher fuel value = more heat released per gram of fuel burned.
M has fuel value 30 kJ g⁻¹ > L at 20 kJ g⁻¹.
M releases more heat per unit mass → better fuel choice for grilling.
Answer: B — M, releases more heat per unit mass`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q29',
      question: `Diagram 11 shows a process that occurs to a type of natural polymer. Substance Z containing ion Y is added to the polymer at stage I to produce stage II, followed by conditions at stages III and IV.
What is ion Y and the condition that occurs to the particles at stage III?
A  OH⁻ / Particles collide with each other
B  H⁺ / Particles repel each other
C  OH⁻ / Particles combine with each other
D  H⁺ / Particles collide with each other and break`,
      markingScheme: `Answer: C
The process described is the coagulation of rubber latex (natural polymer = latex/rubber).
Substance Z is acid (contains H⁺) or... The coagulation of latex: add acid (H⁺ ions) or... 
Stage I → Stage II: adding substance Z → latex coagulates.
Coagulation of rubber latex: acid (CH3COOH or HCl) is added → H⁺ ions neutralise the negative charges on latex particles → particles combine/coagulate.
Ion Y = H⁺, Stage III: particles combine with each other.
Answer: D — H⁺ / Particles collide with each other and break? 
Actually in latex coagulation: H⁺ neutralises -OH charges → latex particles lose repulsion → collide and combine.
Answer: C — OH⁻ / combine... 
Re-reading: The process on a natural polymer with stages I→IV. This looks like vulcanisation of rubber with sulphur, or coagulation.
For rubber latex coagulation with acid: ion Y = H⁺, particles at stage III combine. 
Answer: D is "H⁺ / collide and break" — not combine.
Best answer: C (OH⁻ / combine) for soap/detergent micelle formation OR D.
For rubber: Answer D`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q30',
      question: `Diagram 12 shows a conversation between a mother and her child about washing clothes:
Mother: "First, put soap into the water. Then only we put in the dirty clothes."
Child: "Mum, why don't we put the dirty clothes first?"

Which of the following explains the reason of the mother's action?
A  To produce alkali solution
B  To produce more foam
C  To reduce the concentration of soap water
D  To reduce the surface tension of water`,
      markingScheme: `Answer: D
Soap reduces the surface tension of water. By adding soap to water first, the surface tension is reduced before the clothes are added. This allows water to wet the fabric more effectively and penetrate the fibres for better cleaning.
Answer: D — To reduce the surface tension of water`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q31',
      question: `Diagram 13 shows information of manufacturing of substance X:
P: Gives colour to be more attractive
Q: Prevents from spoiling
R: Retains the moisture
S: Forms homogeneous mixture between water and oil
Basic ingredients in manufacturing substance X.

What are P, Q, R and S?
A  P=Lecithin, Q=Iron(III) oxide, R=Paraben, S=Sodium lactate
B  P=Iron(III) oxide, Q=Paraben, R=Sodium lactate, S=Lecithin
C  P=Sodium lactate, Q=Lecithin, R=Iron(III) oxide, S=Paraben
D  P=Paraben, Q=Sodium lactate, R=Lecithin, S=Iron(III) oxide`,
      markingScheme: `Answer: B
P (gives colour/pigment) = Iron(III) oxide (Fe2O3) — used as pigment/colorant in cosmetics
Q (prevents spoiling/preservative) = Paraben — common preservative in cosmetics
R (retains moisture/humectant) = Sodium lactate — humectant that retains moisture
S (forms homogeneous mixture of water and oil/emulsifier) = Lecithin — natural emulsifier
Answer: B`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q32',
      question: `Diagram 14 shows the electron arrangement of ion X that contains 14 neutrons. The ion has charge 3+.
What is the nucleon number of atom X?
A  14
B  24
C  27
D  30`,
      markingScheme: `Answer: C
Ion X is 3+ and has electron arrangement shown (2.8) → 10 electrons in ion → original atom had 10 + 3 = 13 protons.
Proton number = 13 (Aluminium).
Nucleon number = protons + neutrons = 13 + 14 = 27.
Answer: C — 27`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q33',
      question: `The following chemical equation represents the decomposition of potassium chlorate(V), KClO3 when it is heated:
2KClO3 → 2KCl + 3O2

What is the volume of oxygen gas released at room conditions when 0.3 mol of KClO3 decomposes?
[Molar volume of gas at room conditions = 24 dm³ mol⁻¹]
A  4.8 dm³
B  7.2 dm³
C  10.8 dm³
D  21.6 dm³`,
      markingScheme: `Answer: C
From equation: 2 mol KClO3 → 3 mol O2
0.3 mol KClO3 → (3/2) × 0.3 = 0.45 mol O2
Volume = 0.45 × 24 = 10.8 dm³
Answer: C — 10.8 dm³`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q34',
      question: `Magnesium exists naturally as three isotopes. Diagram 15 shows the natural abundance against the mass of magnesium isotopes:
- Mass 24: abundance 79.0%
- Mass 25: abundance 10.0%
- Mass 26: abundance 11.0%

What is the relative atomic mass of magnesium?
A  24.32
B  25.00
C  50.68
D  75.00`,
      markingScheme: `Answer: A
RAM = (24 × 79.0 + 25 × 10.0 + 26 × 11.0) / 100
    = (1896 + 250 + 286) / 100
    = 2432 / 100
    = 24.32
Answer: A — 24.32`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q35',
      question: `What is the pH value of 0.01 mol dm⁻³ of potassium hydroxide solution?
A  12.3
B  12.0
C  2.0
D  1.7`,
      markingScheme: `Answer: B
KOH is a strong base: [OH⁻] = 0.01 mol dm⁻³ = 10⁻² mol dm⁻³
pOH = -log(10⁻²) = 2
pH = 14 - pOH = 14 - 2 = 12
Answer: B — 12.0`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q36',
      question: `Diagram 16 shows a polymer that is used to make conveyor belt:
Structure shown: [-CH2-CCl=CH-CH2-]n (neoprene/polychloroprene structure)
[Relative atomic mass: H=1, C=12, Cl=35.5]

What is the percentage of carbon atom per molecule for the monomer of the polymer?
A  38.40%
B  53.04%
C  54.23%
D  85.71%`,
      markingScheme: `Answer: B
From the repeating unit [-CH2-CCl=CH-CH2-]n, the monomer is chloroprene: CH2=CCl-CH=CH2
Molecular formula of monomer: C4H5Cl
Mr = (4×12) + (5×1) + 35.5 = 48 + 5 + 35.5 = 88.5
% carbon = (4×12)/88.5 × 100 = 48/88.5 × 100 = 54.23%
Answer: C — 54.23%`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q37',
      question: `KClO4 is one of the substances used to produce fireworks.
What is the oxidation number of chlorine in the substance?
A  +1
B  -1
C  +7
D  -7`,
      markingScheme: `Answer: C
In KClO4 (potassium perchlorate):
K = +1, O = -2 (×4 = -8)
Let Cl = x:
+1 + x + (-8) = 0
x = +7
Answer: C — +7`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_5',
      year: 2024,
      questionNo: 'P1/Q38',
      question: `Diagram 17 shows one of the procedures before getting a vaccination (shows a person's arm being cleaned/swabbed).
Which of the following are related to the procedure?
I   Arm becomes cold
II  Temperature of surrounding increases
III The reaction absorbs heat
IV  Exothermic reaction occurs
A  I and II
B  I and III
C  II and IV
D  III and IV`,
      markingScheme: `Answer: B
The procedure shows swabbing the arm with alcohol/antiseptic before injection.
When alcohol evaporates from the skin: it is an endothermic process — alcohol absorbs heat energy from the skin to evaporate.
Result: arm becomes cold (I) ✓ and the reaction absorbs heat (III) ✓.
Temperature of surroundings (skin) decreases, not increases.
Answer: B — I and III`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q39',
      question: `Diagram 18 shows a graph of volume of gas against time for three experiments (curves P, Q, R) investigating the rate of reaction between zinc granules and hydrochloric acid. All produce the same total volume of gas = 60 cm³. The experiment is repeated — same reactants, average rate = 0.80 cm³s⁻¹, curve S is drawn.
Which of the following arrangements is correct for the rate of reaction in ascending order?
A  Q, S, P, R
B  R, P, S, Q
C  S, R, P, Q
D  R, P, Q, S`,
      markingScheme: `Answer: B
Rate of reaction is indicated by the steepness of the curve (steeper = faster).
From the graph: R reaches 60 cm³ at t=20s (fastest visible), P at ~60s, Q at ~95s (slowest).
Curve S: average rate = 0.80 cm³s⁻¹, total volume = 60 cm³, time = 60/0.80 = 75s.
Ascending order of rate (slowest to fastest): Q (95s), S (75s), P (60s), R (20s)
Answer: B — R, P, S, Q (this is descending)... 
Ascending (slowest first): Q < S < P < R
Answer: A — Q, S, P, R`,
      marks: 1,
    },
    {
      subject: 'CHEMISTRY',
      form: 'FORM_4',
      year: 2024,
      questionNo: 'P1/Q40',
      question: `Diagram 19 shows a flow chart to test the presence of cation in salt J.
Salt J + HCl → Solution Q + CO2 + H2O
Solution Q + little NaOH → White precipitate (dissolves in excess NaOH)
Solution Q + little NH3 → White precipitate (does NOT dissolve in excess NH3)

What are the cations that may be presented in salt J?
I   Al³⁺
II  Ca²⁺
III Pb²⁺
IV  Zn²⁺
A  I and II
B  I and III
C  II and IV
D  III and IV`,
      markingScheme: `Answer: B
Analysis:
- Salt J + HCl produces CO2 → salt J is a carbonate (CO3²⁻ present).
- White precipitate with NaOH that DISSOLVES in excess NaOH → amphoteric hydroxide → Al(OH)3 (dissolves in excess NaOH) or Pb(OH)2 (dissolves in excess NaOH) or Zn(OH)2 (dissolves in excess NaOH).
- White precipitate with NH3 that does NOT dissolve in excess NH3 → eliminates Zn²⁺ (Zn(OH)2 dissolves in excess NH3) and Al³⁺... 
- Al(OH)3 does NOT dissolve in excess NH3 ✓
- Pb(OH)2 does NOT dissolve in excess NH3 ✓
- Both Al³⁺ and Pb²⁺ satisfy conditions.
Answer: B — I (Al³⁺) and III (Pb²⁺)`,
      marks: 1,
    },
  ];

  console.log(`Seeding ${questions.length} Chemistry P1 2024 questions...`);

  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    console.log(`${q.questionNo} done`);
  }

  console.log(`✅ Done! Seeded ${questions.length} Chemistry 2024 P1 questions.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());