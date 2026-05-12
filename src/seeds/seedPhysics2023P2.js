const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = [
    // SECTION A
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P2-A-Q1', marks: 4,
      question: `Diagram 1 shows land and ocean heated by the sun — a phenomenon due to difference in specific heat capacity.
(a) What is meant by specific heat capacity?
(b)(i) Tick the correct answer: During day time, land heats up faster / sea water heats up faster.
(b)(ii) Give one reason for your answer in (b)(i).
(c) Name the phenomenon that occurs in Diagram 1.`,
      markingScheme: `(a) The amount of heat energy required to raise the temperature of 1 kg of a substance by 1 degree Celsius (or 1 K). [1m]
(b)(i) During day time, land heats up faster. [1m]
(b)(ii) Land has lower specific heat capacity than sea water, so it requires less heat energy to raise its temperature by the same amount. [1m]
(c) Sea breeze (angin laut) / Land and sea breeze phenomenon. [1m]`
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P2-A-Q2', marks: 5,
      question: `Diagram 2 shows a Force (F) vs Extension (X) graph for a steel spring. Maximum force = 20 N at extension X = 8 cm.
(a) Underline the correct answer: The relationship between force and extension is explained by (Ohm's Law / Hooke's Law).
(b) Calculate the spring constant of the steel spring.
(c)(i) What happens to the gradient of the graph if the steel spring is replaced with a copper spring of the same physical properties?
(c)(ii) Give one reason for your answer in (c)(i).`,
      markingScheme: `(a) Hooke's Law [1m]
(b) k = F/X = 20/(8/100) = 20/0.08 = 250 N/m [2m — 1 for formula, 1 for answer]
(c)(i) The gradient remains the same / unchanged. [1m]
(c)(ii) The physical properties (length, cross-sectional area) are the same, so the spring constant is the same regardless of material type. [1m]`
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P2-A-Q3', marks: 6,
      question: `Diagram 3 shows a ray diagram for a convex lens. Object is beyond 2F, image formed beyond F on opposite side (real, inverted, diminished).
(a) What is another name for a convex lens?
(b) Complete Diagram 3 by drawing another one light ray to show image formation.
(c)(i) The lens is changed to a thicker lens. What happens to the focal length?
(c)(ii) State the change in size of image if object remains at the same position.
(d) Object at 12 cm from optical centre. Real image formed at 9 cm. Calculate linear magnification.`,
      markingScheme: `(a) Converging lens [1m]
(b) Draw ray parallel to principal axis through lens, refracted through focal point F (or ray through optical centre undeviated). [1m]
(c)(i) Focal length decreases (shorter focal length). [1m]
(c)(ii) Image becomes larger/bigger. [1m]
(d) m = v/u = 9/12 = 0.75 [2m — 1 for formula, 1 for answer]`
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q4', marks: 9,
      question: `Diagram 4 shows a transistor circuit as automatic switch. R2 = 10 kΩ, R1 = 1 kΩ, LDR in base circuit, Transistor K, Bulb, 18V supply.
(a) Name the type of transistor K.
(b) Explain how the bulb in Diagram 4 can light up in the dark. [3 marks]
(c) LDR resistance in the dark = 50 kΩ. Calculate:
(i) voltage across the LDR [3 marks]
(ii) current flowing through the LDR [2 marks]`,
      markingScheme: `(a) n-p-n transistor [1m]
(b) In the dark, LDR resistance increases -> voltage across LDR increases -> base voltage increases -> base current (Ib) increases -> collector current (Ic) increases -> sufficient current flows through bulb -> bulb lights up. [3m]
(c)(i) Total resistance in base circuit = R2 + R_LDR = 10k + 50k = 60 kΩ.
V_LDR = (R_LDR / R_total) x V = (50k/60k) x 18 = 15 V. [3m]
(c)(ii) I = V/R = 15/(50 x 10^3) = 3 x 10^-4 A = 0.3 mA. [2m]`
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P2-A-Q5', marks: 9,
      question: `Diagrams 5.1 and 5.2 show water wave patterns through slits of different sizes (a=3.0cm and a=1.0cm). Wavelength and frequency are the same. Diagram 5.2 shows more spreading.
(a) Name the wave phenomenon in Diagram 5.2.
(b) Compare Diagrams 5.1 and 5.2:
(i) size of slit
(ii) amplitude of waves after passing through slit
(iii) spreading of waves after slit
(c) Based on (b), relate: (i) slit size with spreading  (ii) amplitude with spreading
(d) Why does amplitude change after waves pass through slit?
(e) Sound from flood siren speaker cannot be heard clearly by residents. What change to wave frequency solves this? Explain.`,
      markingScheme: `(a) Diffraction (pembelauan) [1m]
(b)(i) Diagram 5.1 has larger slit (a=3.0cm) than Diagram 5.2 (a=1.0cm). [1m]
(b)(ii) Amplitude in Diagram 5.1 (1.0 cm) is greater than Diagram 5.2 (0.6 cm). [1m]
(b)(iii) Diagram 5.2 shows more spreading than Diagram 5.1. [1m]
(c)(i) Smaller slit -> more spreading of waves (inverse relationship). [1m]
(c)(ii) Less amplitude -> more spreading (more energy distributed over wider area). [1m]
(d) When waves pass through slit, energy is distributed over a wider area, causing amplitude to decrease. [1m]
(e) Decrease the frequency. Lower frequency = longer wavelength = more diffraction around obstacles = sound spreads more widely and can be heard clearly. [2m]`
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q6', marks: 9,
      question: `Diagram 6.1: current-carrying conductor between two bar magnets (catapult field).
(a)(i) Mark the direction of force on the conductor.
(a)(ii) Define catapult field.
(b) Diagrams 6.2(a) and 6.2(b) show electromagnet experiments. 6.2(a): 10 turns, 2 rotations/s, 1.5V. 6.2(b): 10 turns, 5 rotations/s, 3.0V. Compare:
(i) number of turns of coil
(ii) potential difference
(iii) speed of rotation
(c) State relationship between: (i) PD and speed of rotation  (ii) PD and force
(d) Dry cell in 6.2(a) replaced with AC supply 50 Hz. What happens to coil rotation? Give one reason.`,
      markingScheme: `(a)(i) Force direction: upward (using Fleming's Left Hand Rule — current direction given, field from N to S). [1m]
(a)(ii) Catapult field is the combined/resultant magnetic field produced when magnetic field of a current-carrying conductor interacts with an external magnetic field, causing a force on the conductor. [1m]
(b)(i) Both have 10 turns — same number of coil turns. [1m]
(b)(ii) 6.2(b) has higher PD (3.0V) than 6.2(a) (1.5V). [1m]
(b)(iii) 6.2(b) has higher speed of rotation (5 rot/s) than 6.2(a) (2 rot/s). [1m]
(c)(i) PD is directly proportional to speed of rotation — higher speed = higher PD. [1m]
(c)(ii) PD is directly proportional to force — higher force = higher PD. [1m]
(d) The coil will rotate alternately (oscillate/vibrate) left and right / rotate in both directions alternately. Reason: AC current reverses direction 50 times per second, causing force direction to reverse, making coil rotate alternately. [2m]`
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P2-A-Q7', marks: 9,
      question: `Diagram 7: communication satellite orbiting Earth at height h = 30500 km. Earth radius R = 6370 km.
(a) Name the force that keeps satellite in orbit.
(b)(i) Calculate orbital radius r.
(b)(ii) Calculate linear speed v of satellite. [2 marks]
(c) Table 7: Satellite P (Geostationary, 24h), Q (Non-geostationary, 12h), R (Geostationary, 12h). State suitable characteristics for live broadcast worldwide: (i) type and reason  (ii) orbital period and reason.
(d) Determine the most suitable satellite for the telecommunications agency.`,
      markingScheme: `(a) Gravitational force (Daya graviti) [1m]
(b)(i) r = R + h = 6370 + 30500 = 36870 km = 3.687 x 10^7 m [1m]
(b)(ii) Period T = 24 hours = 86400 s (geostationary).
v = 2*pi*r / T = 2*pi*(3.687x10^7) / 86400 = 2.68 x 10^3 m/s = 2680 m/s [2m]
(c)(i) Type: Geostationary. Reason: Always remains above the same point on Earth, enabling continuous live broadcast to the same region. [2m]
(c)(ii) Orbital period: 24 hours. Reason: Period equals Earth's rotation period, so satellite stays stationary relative to Earth's surface. [2m]
(d) Satellite P. It is geostationary (always above same location) with 24-hour period matching Earth's rotation — suitable for live worldwide broadcast. [1m]`
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q8', marks: 9,
      question: `Diagram 8.1: circuit with EMF = 6V, internal resistance r = 2Ω, external resistance R.
(a) What is meant by electromotive force (EMF)?
(b) Calculate ammeter reading in Diagram 8.1. [2 marks]
(c) Diagram 8.2: dim torch light using one battery. State modifications for brighter light based on:
(i) number of batteries — state change and reason
(ii) arrangement of batteries — state arrangement and reason
(iii) type of bulb — state type and reason`,
      markingScheme: `(a) EMF is the total energy supplied per unit charge by the source / energy converted from other forms to electrical energy per coulomb of charge. [1m]
(b) From diagram: R appears to be variable. With R=4Ω: I = EMF/(R+r) = 6/(4+2) = 1 A. [2m]
(c)(i) Increase number of batteries. More batteries = higher total EMF = more current = brighter bulb. [2m]
(c)(ii) Connect batteries in series. Series arrangement increases total EMF, providing higher voltage to bulb. [2m]
(c)(iii) Use LED bulb. LED bulb is more energy efficient, converts more electrical energy to light, producing brighter light for same current. [2m]`
    },

    // SECTION B (answer 1 of 2)
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P2-B-Q9', marks: 20,
      question: `Diagram 9.1: construction worker operating pile driver machine. Force produced when pile driver hits pile.
(a) Name the force acting on the pile. [1 mark]
(b) Workers must wear safety helmet. Explain appropriate safety helmet features to protect from serious injury. [4 marks]
(c) Table 9 shows four pile systems P, Q, R, S:
P: height 8m, mass 200kg, Iron, rounded tip
Q: height 12m, mass 150kg, Iron, pointed tip
R: height 12m, mass 200kg, Concrete, pointed tip
S: height 8m, mass 100kg, Concrete, rounded tip
Study each characteristic and explain suitability. Determine most suitable piling system. Give reasons. [10 marks]
(d) Pile driver mass 450 kg released from stationary. Time of motion before impact = 2 s. Calculate:
(i) velocity of pile driver just before impact [3 marks]
(ii) change in momentum of pile driver [2 marks]`,
      markingScheme: `(a) Impulsive force (daya impuls) / Weight of pile driver [1m]
(b) Features: Hard outer shell (absorbs impact/distributes force over larger area); Cushioning/padding inside (increases time of impact, reduces impulsive force); Lightweight material (reduces strain on neck); Ventilation holes (comfort for prolonged wear). [4m — 1m each for 4 features with reasons]
(c) Analysis of each characteristic:
Height: Q and R have higher height (12m) -> greater velocity on impact -> greater force on pile. MORE suitable.
Mass: P and R have higher mass (200kg) -> greater momentum -> greater impulsive force. MORE suitable.
Material: Iron (P,Q) harder and denser than concrete -> can penetrate ground better. Iron MORE suitable.
Tip shape: Pointed tip (Q,R) -> smaller area -> higher pressure -> better penetration into ground. Pointed MORE suitable.
Most suitable: Q (12m height, iron, pointed tip) — though mass only 150kg vs R's 200kg, Q's combination of height + iron + pointed tip makes it most suitable for penetration.
OR R: highest height + heaviest + pointed tip, but concrete is less suitable than iron.
Best answer: R — highest height (12m), heaviest (200kg), pointed tip (better penetration). Concrete is acceptable.
[10m — 2m each for 4 characteristics + 2m for conclusion with justification]
(d)(i) a = g = 10 m/s^2. v = u + at = 0 + 10(2) = 20 m/s [3m]
(d)(ii) Change in momentum = mv - mu = 450(20) - 0 = 9000 kg m/s [2m]`
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P2-B-Q10', marks: 20,
      question: `Diagram 10.1: Fortin barometer to measure atmospheric pressure (Vernier scale, main scale, mercury tube, bag, pointer).
(a) What is meant by atmospheric pressure? [1 mark]
(b)(i) Explain why mercury is used in the Fortin barometer glass tube. [3 marks]
(b)(ii) Why is Vernier scale used in Fortin barometer? [1 mark]
(c) Table 10: four barometers P, Q, R, S with different bag materials, tube materials, pointer materials, additional instruments. Study characteristics and determine most suitable. [10 marks]
(d) Atmospheric pressure at sea level = 76 cm Hg, at mountain top = 30 cm Hg. Density of mercury = 1.36 x 10^4 kg/m^3, density of air = 1.3 kg/m^3.
(i) Calculate atmospheric pressure at sea level in mbar. [3 marks]
(ii) Calculate height of mountain in metres. [2 marks]`,
      markingScheme: `(a) Atmospheric pressure is the pressure exerted by the weight of the column of air above a unit area of the Earth's surface. [1m]
(b)(i) Mercury is used because: (1) High density (13600 kg/m^3) — requires short column of only ~76cm instead of 10m for water; (2) Low vapour pressure — does not evaporate easily, maintains accurate readings; (3) Does not stick to glass — meniscus is clear and easy to read. [3m]
(b)(ii) Vernier scale is used to obtain more precise/accurate readings to 0.1mm, reducing parallax error. [1m]
(c) Most suitable barometer characteristics:
Bag material: Leather (flexible, maintains mercury level when adjusted) — Q or R
Tube material: Glass (transparent, can read mercury level clearly; resistant to mercury) — P or S
Pointer material: Ivory (does not rust/corrode in mercury; white color contrasts with mercury) — P or Q
Additional instrument: Thermometer (to correct for temperature effects on mercury density)
Most suitable: Q — leather bag (flexible adjustment), brass tube (durable, mercury-resistant), ivory pointer (corrosion-resistant), thermometer (temperature correction). [10m]
(d)(i) P = rho*g*h = 13600 x 10 x 0.76 = 103360 Pa = 103360/100 hPa = 1033.6 hPa = 1033.6 mbar. [3m]
(d)(ii) Difference in Hg column = 76-30 = 46 cm Hg = 0.46 m Hg.
P_diff = rho_Hg x g x 0.46 = 13600 x 10 x 0.46 = 62560 Pa.
h_air = P_diff / (rho_air x g) = 62560 / (1.3 x 10) = 4812 m. [2m]`
    },

    // SECTION C (compulsory)
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P2-C-Q11', marks: 20,
      question: `Diagram 11: half-life graph for Radioisotope X and Radioisotope Y. X decays faster (shorter half-life T1), Y decays slower (longer half-life T2). Both start at N0 nuclei.
(a) What is meant by half-life? [1 mark]
(b) Compare number of original nuclei, half-life and decay rate between X and Y. Relate number of nuclei with half-life, then deduce relationship between half-life and decay rate. [5 marks]
(c) Radioisotope Y undergoes nuclear fission and produces nuclear energy. Explain why nuclear energy can be produced during fission. [4 marks]
(d) Government proposes using nuclear energy for electricity generation. As a scientist, propose recommendations involving: nuclear reactor wall thickness, types of radioisotopes, reactor safety, turbines and solenoids in electric generators. [10 marks]`,
      markingScheme: `(a) Half-life is the time taken for half the number of radioactive nuclei in a sample to decay. [1m]
(b) Comparison:
- Both X and Y start with the same number of original nuclei N0.
- Half-life of X (T1) is shorter than half-life of Y (T2).
- Decay rate of X is higher than decay rate of Y.
Relationship: Both X and Y have same N0, but X has shorter half-life -> X decays faster.
Deduction: Shorter half-life -> higher decay rate. Half-life is inversely proportional to decay rate. [5m]
(c) During nuclear fission, a heavy nucleus (e.g. U-235) splits into two lighter nuclei. The total mass of products is LESS than original nucleus. This mass defect is converted to energy according to E = mc^2 (Einstein's mass-energy equivalence). The energy released is nuclear/binding energy. [4m]
(d) Recommendations:
Wall thickness: Thick concrete/lead walls (minimum 2m) — thick walls absorb radiation (alpha, beta, gamma) and neutrons, preventing radiation leakage and protecting workers/public.
Radioisotope: Use Uranium-235 or Plutonium-239 — these are fissile materials that can sustain chain reaction to produce sufficient energy.
Reactor safety: Install control rods (graphite/boron) to absorb neutrons and control reaction rate; cooling system (water) to prevent overheating; automatic shutdown system for emergency.
Turbines: Use high-efficiency steam turbines — nuclear heat converts water to steam, steam drives turbines to generate electricity; high temperature steam = more kinetic energy = more efficient conversion.
Solenoids: Use copper solenoids with many turns in strong magnetic field — more turns = greater EMF = more electricity generated per rotation; copper = low resistance = less energy loss. [10m — 2m each for 5 aspects]`
    },
  ];

  console.log(`Seeding ${questions.length} questions — PHYSICS 2023 P2...`);
  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    console.log(`  ${q.questionNo} done`);
  }
  console.log('\nDone. 11 questions seeded (A:8, B:2, C:1).');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });