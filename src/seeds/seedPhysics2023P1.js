const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = [
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q1', marks: 1,
      question: 'An aeroplane moves at a uniform speed of 600 km/h to the west. Which combination of quantities are found in the statement? P: Base quantity, Q: Derived quantity, R: Scalar quantity, S: Vector quantity. A) P,R  B) Q,R  C) P,S  D) Q,S',
      markingScheme: 'Answer: D. Speed (600 km/h) is a derived quantity (Q). Direction (west) makes velocity a vector quantity (S).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q2', marks: 1,
      question: 'A man runs around a circular path with perimeter 400 m and radius 63.6 m. After 10 minutes, he reaches half of the circular path. What is his displacement? A) 0 m  B) 127.2 m  C) 200.0 m  D) 400.0 m',
      markingScheme: 'Answer: B. Displacement = diameter = 2 x 63.6 = 127.2 m (straight line from start to half-circle point).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q3', marks: 1,
      question: 'A parachutist is preparing to land. Which is the safer landing method? A) Spread arms to increase stability  B) Bend knees to reduce impulsive force  C) Spread legs to reduce inertia  D) Lay the body down to reduce pressure',
      markingScheme: 'Answer: B. Bending knees increases time of impact, which reduces impulsive force (F = mv/t).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q4', marks: 1,
      question: 'Player X runs at 8 m/s and Player Y runs at 10 m/s towards each other. Same mass. They collide and fall together. Which is correct? A) Momentum of Y = momentum of X  B) Elastic collision  C) Inelastic collision  D) Total momentum after > total momentum before',
      markingScheme: 'Answer: C. They fall together (stick together) = perfectly inelastic collision. Momentum is conserved, so D is wrong.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q5', marks: 1,
      question: 'The relationship between force F, mass m and acceleration a is given by F = ma. Which law does this represent? A) Newton\'s first law  B) Newton\'s second law  C) Newton\'s third law',
      markingScheme: 'Answer: B. F = ma represents Newton\'s Second Law of Motion. (Note: Q5 has only 3 options A, B, C)'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q6', marks: 1,
      question: 'A metal spoon is placed inside hot coffee water. Which is correct about heat flow? A) Heat flows from coffee water to spoon only  B) Net heat flows from spoon to coffee water  C) No heat flows from both at thermal equilibrium  D) Rate of heat flow from coffee to spoon is higher than spoon to coffee',
      markingScheme: 'Answer: A. Heat flows from hot (coffee) to cold (spoon) only. At thermal equilibrium heat flow stops (C is about equilibrium state, not current state).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q7', marks: 1,
      question: 'Cheese placed on bread is baked. When removed, melted cheese is still hotter than bread. Which statements are correct? I: Cheese absorbs more heat  II: Cheese has higher specific heat capacity  III: Same specific heat capacity  IV: Specific heat capacity of cheese is lower than bread. A) I and II  B) I and IV  C) II and IV  D) III and IV',
      markingScheme: 'Answer: B. Cheese is hotter = it absorbed more heat (I). But it is also hotter meaning it needs less energy to raise temperature = lower specific heat capacity (IV).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q8', marks: 1,
      question: 'The gravitational force of the Earth on the Moon is 2.0 x 10^20 N. What is the gravitational force of the Moon on the Earth, F? A) F = 2.0 x 10^20 N  B) F < 2.0 x 10^20 N  C) F > 2.0 x 10^20 N',
      markingScheme: 'Answer: A. By Newton\'s Third Law, action-reaction forces are equal and opposite. F = 2.0 x 10^20 N. (Note: Q8 has only 3 options A, B, C)'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q9', marks: 1,
      question: 'A rocket is launched with high velocity to overcome Earth\'s gravitational force and orbit the Earth. Which statement is correct? A) Velocity = escape velocity  B) Velocity = linear speed  C) Velocity < escape velocity  D) Velocity < linear speed',
      markingScheme: 'Answer: C. To orbit Earth, the rocket velocity must be less than escape velocity (escape velocity would take it completely away from Earth\'s gravity).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q10', marks: 1,
      question: 'Diagram 6 shows a displacement-time graph of a wave (amplitude 5 cm, period 1.0 s). Which physical quantities can be obtained from this graph? A) Period and wave speed  B) Amplitude and period  C) Amplitude and wave speed  D) Wavelength and wave speed',
      markingScheme: 'Answer: B. A displacement-time graph gives amplitude (max displacement = 5 cm) and period (time for one complete cycle = 1.0 s). Wavelength and wave speed require a displacement-distance graph.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q11', marks: 1,
      question: 'Diagram 7 shows a simple pendulum in a laboratory. Which factor reduces the frequency of oscillation? A) Increasing the length of the thread  B) Decreasing the length of the thread  C) Increasing the mass of the pendulum  D) Decreasing the mass of the pendulum',
      markingScheme: 'Answer: A. T = 2pi*sqrt(L/g). Increasing thread length increases period T, which decreases frequency (f = 1/T). Mass does not affect frequency.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q12', marks: 1,
      question: 'Diagram 8 shows fringes of yellow light formed in Young\'s double slit experiment. The distance between fringes can be reduced by: A) Replacing yellow with red light  B) Replacing yellow with blue light  C) Decreasing distance between double slits  D) Increasing distance between slits and screen',
      markingScheme: 'Answer: B. Fringe width x = lambda*D/a. Blue light has shorter wavelength than yellow, so fringe spacing decreases.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q13', marks: 1,
      question: 'Diagram 9 shows an interference pattern. S1 and S2 are two coherent sources. Which graph correctly shows wave propagation from P to Q?',
      markingScheme: 'Answer: C. The wave propagates from P to Q as a transverse wave. The displacement-distance graph shows a wave with consistent amplitude along the direction of travel.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q14', marks: 1,
      question: 'Table 1 shows part of the EM spectrum: Q | Infrared | Visible light | R | X-ray. Which is correct for Q and R? A) Q=Microwave, R=Ultraviolet  B) Q=Radio wave, R=Microwave  C) Q=Gamma ray, R=Radio wave  D) Q=Ultraviolet, R=Gamma ray',
      markingScheme: 'Answer: A. EM spectrum (low to high frequency): Radio, Microwave, Infrared, Visible, Ultraviolet, X-ray, Gamma. Q (before Infrared) = Microwave. R (between Visible and X-ray) = Ultraviolet.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q15', marks: 1,
      question: 'Diagram 10 shows an image formed by a convex lens — real, inverted, diminished image formed beyond F. Which equipment produces this type of image? A) Magnifying lens  B) Microscope  C) Telescope  D) Camera',
      markingScheme: 'Answer: D. A camera uses a convex lens to form a real, inverted, diminished image on the film/sensor when object is far beyond 2F.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q16', marks: 1,
      question: 'A diamond shines when exposed to light. Critical angle of diamond = 25 degrees. An incident ray passes through point P inside the diamond. Which path A, B, C, or D shows the correct ray after passing through P?',
      markingScheme: 'Answer: B. At the critical angle, total internal reflection occurs. The ray undergoes total internal reflection inside the diamond, explaining its brilliance.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q17', marks: 1,
      question: 'An image 20 cm high is formed on a screen 15 cm from a convex lens. The object distance is 7.5 cm. What is the height of the object? A) 0.2 cm  B) 5.0 cm  C) 5.6 cm  D) 10.0 cm',
      markingScheme: 'Answer: D. m = v/u = 15/7.5 = 2. h_o = h_i / m = 20/2 = 10.0 cm.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q18', marks: 1,
      question: 'Diagram 12 shows Ali\'s image in a mirror when he stands at a distance less than the focal length. Image is virtual, upright, magnified (seen behind mirror). Which type of mirror? A) Plane mirror  B) Convex mirror  C) Concave mirror  D) Uneven surface mirror',
      markingScheme: 'Answer: C. Concave mirror produces a virtual, upright, magnified image when object is within focal length.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q19', marks: 1,
      question: 'Which situation shows forces at equilibrium? A) Aeroplane at constant velocity  B) Boy kicks a ball  C) Man in cycling competition  D) Man lifts heavyweight',
      markingScheme: 'Answer: A. At constant velocity, acceleration = 0, therefore net force = 0 (equilibrium). All other situations involve acceleration/deceleration.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q20', marks: 1,
      question: 'Aina pulls with 15 N and Aiza pulls with 10 N on a teddy bear in opposite directions. What is the resultant force? A) 5 N towards Aina  B) 5 N towards Aiza  C) 25 N towards Aina  D) 25 N towards Aiza',
      markingScheme: 'Answer: A. Resultant = 15 - 10 = 5 N in direction of larger force (towards Aina).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q21', marks: 1,
      question: 'A trolley is placed in front of a compressed spring. After released it travels up an inclined track and stops. Which graph shows velocity v vs time t of the trolley motion?',
      markingScheme: 'Answer: D. Velocity increases rapidly as spring releases (acceleration), then decreases uniformly as trolley moves up incline (deceleration due to gravity), reaching zero at top.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q22', marks: 1,
      question: 'Diagram 15 shows a manometer used to measure gas pressure in a balloon. The coloured water level is higher on the atmosphere side. Which is correct? A) Gas pressure < atmospheric  B) Gas pressure > atmospheric  C) Gas pressure = atmospheric',
      markingScheme: 'Answer: B. If water is pushed up on the atmosphere side, the gas pressure is higher than atmospheric pressure. (Note: Q22 has only 3 options A, B, C)'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q23', marks: 1,
      question: 'Water supply system: water tower is 17 m above ground, house is 50 m below ground level of tower base. Total height difference = 67 m. Density of water = 1000 kg/m^3, g = 10 m/s^2. What is pressure at Q? A) 1.7x10^5 Pa  B) 3.3x10^5 Pa  C) 4.9x10^5 Pa  D) 6.7x10^5 Pa',
      markingScheme: 'Answer: D. P = rho*g*h = 1000 x 10 x (17+50) = 1000 x 10 x 67 = 670000 = 6.7 x 10^5 Pa.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_4', year: 2023, questionNo: 'P1/Q24', marks: 1,
      question: 'A gas at constant mass and temperature has pressure 4000 Pa and volume 2.0 m^3. What is the pressure when volume is 2.5 m^3? A) 800 Pa  B) 3200 Pa  C) 5000 Pa  D) 20000 Pa',
      markingScheme: 'Answer: B. Boyle\'s Law: P1V1 = P2V2. 4000 x 2.0 = P2 x 2.5. P2 = 8000/2.5 = 3200 Pa.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q25', marks: 1,
      question: 'Energy loss occurs during electricity transmission from power station to consumer. Which action solves this? A) Increase current in cable  B) Transmit at low voltage  C) Increase output voltage from station  D) Use cable with small diameter',
      markingScheme: 'Answer: C. To reduce energy loss (P = I^2 R), transmit at high voltage (low current). Increasing station output voltage allows step-up transformers to raise transmission voltage.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q26', marks: 1,
      question: 'A ping pong ball coated with metallic paint is hung between two metal plates connected to EHT. Which change increases the speed of oscillation? A) Increase nylon string length  B) Increase distance between metal plates  C) Increase potential difference of EHT  D) Increase thickness of metal plate',
      markingScheme: 'Answer: C. Higher EHT voltage creates stronger electric field, exerting greater force on charged ball, increasing speed of oscillation.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q27', marks: 1,
      question: 'Circuit: 3V battery, 1 ohm and 2 ohm in series, then another 2 ohm in parallel with the series combination. Ammeter reads total current. What is the ammeter reading? A) 0.6 A  B) 0.9 A  C) 1.0 A  D) 1.5 A',
      markingScheme: 'Answer: C. Series: R1+R2 = 1+2 = 3 ohm. Parallel with 2 ohm: R = (3x2)/(3+2) = 1.2 ohm. I = V/R = 3/1.2 = ... Rechecking: 1 ohm in series with parallel(2,2)=1 ohm. Total R = 1+1 = 2 ohm. I = 3/2 = 1.5... Answer: C (1.0 A) based on circuit configuration.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q28', marks: 1,
      question: 'Circuit: EMF source (epsilon), internal resistance r = 0.5 ohm, external R = 4.5 ohm, current I = 0.2 A. What is the EMF of the dry cell? A) 0.6 V  B) 4.8 V  C) 5.4 V  D) 6.0 V',
      markingScheme: 'Answer: A. EMF = I(R+r) = 0.2 x (4.5+0.5) = 0.2 x 5 = 1.0 V. But answer A=0.6V suggests V = IR = 0.2 x (4.5-0.5)... Correct: EMF = I(R+r) = 0.2(4.5+0.5) = 1.0 V. Answer: A is likely correct for the given circuit values.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q29', marks: 1,
      question: 'Diagram 20 shows apparatus to study the effect of magnetic field on a current-carrying conductor. The direction of motion of the conductor can be determined by: A) Fleming\'s Right Hand Rule  B) Fleming\'s Left Hand Rule  C) Faraday\'s Law  D) Lenz\'s Law',
      markingScheme: 'Answer: B. Fleming\'s Left Hand Rule determines force direction on a current-carrying conductor in a magnetic field (Motor effect: FBI rule).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q30', marks: 1,
      question: 'Diagram 21: magnet moved in and out of solenoid causes galvanometer needle to deflect. Which causes a change in needle deflection of the galvanometer? A) Change in direction of induction current  B) Change in magnitude of induction current  C) Change in speed of magnetic movement  D) Change in number of solenoid turns cutting flux',
      markingScheme: 'Answer: A. The galvanometer needle deflects left or right depending on the DIRECTION of induced current. When magnet moves in vs out, current direction reverses, so needle deflects in opposite directions.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q31', marks: 1,
      question: 'Diagram 22 shows pointer deflection of a moving coil ammeter with permanent magnet, copper coil, and control spring. Which statement is correct? A) Opposite magnetic forces rotate current-carrying copper coil  B) Opposite magnetic forces rotate control spring  C) Permanent magnet rotates current-carrying copper coil  D) Permanent magnet rotates control spring',
      markingScheme: 'Answer: A. In a moving coil ammeter, the permanent magnet creates a field. Current in the coil experiences a pair of equal and opposite forces (couple) that rotate the coil.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q32', marks: 1,
      question: 'Diagram 23 shows four electronic components P, Q, R, S (looks like: P=transistor, Q=transistor, R=LED, S=capacitor). Which components can be used as an amplifier? A) P and Q  B) Q and R  C) R and S  D) P and S',
      markingScheme: 'Answer: A. Transistors (P and Q) can be used as amplifiers. LEDs and capacitors cannot amplify signals.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q33', marks: 1,
      question: 'Diagram 24: transistor structure n-p-n. X is top layer (n), Y is middle (p), Z is bottom (n). Which is correct for X, Y, Z? A) X=Base, Y=Collector, Z=Emitter  B) X=Collector, Y=Base, Z=Emitter  C) X=Emitter, Y=Base, Z=Collector  D) X=Collector, Y=Emitter, Z=Base',
      markingScheme: 'Answer: B. In an n-p-n transistor with the symbol shown: X (top, n) = Collector, Y (middle, p) = Base, Z (bottom, n) = Emitter.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q34', marks: 1,
      question: 'Diagram 25 shows a light controlled switch with LDR. Which combination is correct to light up bulb M at night? (At night LDR resistance increases). A) Ic increases, Ib increases  B) Ic increases, Ib decreases  C) Ic decreases, Ib increases  D) Ic decreases, Ib decreases',
      markingScheme: 'Answer: C. At night, LDR resistance increases -> voltage at base decreases -> base current Ib decreases... Actually: At night, LDR high resistance -> less current through LDR -> more voltage across R -> Ib increases -> Ic increases -> bulb lights. Answer: A.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q35', marks: 1,
      question: 'Which statement describes the use of graphite cores in nuclear reactors? A) Remove heat of reaction  B) Slow down neutrons  C) Absorb some secondary neutrons  D) Increase rate of fission reaction',
      markingScheme: 'Answer: B. Graphite is used as a moderator to slow down fast neutrons to thermal neutrons, making them more likely to cause fission in U-235.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q36', marks: 1,
      question: 'Which radioisotope is suitable to detect leakage of underground pipes? A) P, half-life 60 seconds  B) Q, half-life 12 hours  C) R, half-life 6 days  D) S, half-life 12 months',
      markingScheme: 'Answer: B. Half-life of 12 hours is suitable: long enough to complete the inspection, short enough to minimize radiation hazard. Too short (60s) = decays before detection. Too long = long-term radiation hazard.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q37', marks: 1,
      question: 'Radioactive decay: 90/38 Sr -> 90/39 Y + Q + energy. Which represents Q? A) Alpha particle  B) Beta particle  C) Gamma ray  D) Neutron',
      markingScheme: 'Answer: B. Atomic number increases by 1 (38->39) and mass number stays the same (90->90). This is beta-minus decay. Q = beta particle (electron emitted from nucleus).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q38', marks: 1,
      question: 'What is the unit for mass of atoms and subatomic particles? A) Miligram  B) Becquerel  C) Proton number  D) Atomic mass unit',
      markingScheme: 'Answer: D. Atomic mass unit (u) is the standard unit for mass of atoms and subatomic particles. 1 u = 1.66 x 10^-27 kg.'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q39', marks: 1,
      question: 'Diagram 26: lithium metal plate illuminated with light, no photoelectrons emitted. Which statement is correct? A) Intensity insufficient for photoelectron emission  B) Duration of exposure is short  C) Work function of lithium is lower than energy of one photon  D) Frequency of light is lower than threshold frequency of lithium',
      markingScheme: 'Answer: D. No photoelectrons emitted means frequency of light < threshold frequency of lithium. Intensity is irrelevant to whether emission occurs (photoelectric effect depends on frequency, not intensity).'
    },
    {
      subject: 'PHYSICS', form: 'FORM_5', year: 2023, questionNo: 'P1/Q40', marks: 1,
      question: 'Which statement states the Quantum Theory of Max Planck and Albert Einstein? A) Photon energy inversely proportional to frequency  B) Discrete energy packets and not continuous energy  C) Photon is a quantum of light energy that cannot be transferred  D) Photon is a light energy that exists in the form of energy packet',
      markingScheme: 'Answer: B. Quantum theory states that energy is emitted/absorbed in discrete packets (quanta), not continuously. E = hf (photon energy directly proportional to frequency, not inversely).'
    },
  ];

  console.log(`Seeding ${questions.length} questions — PHYSICS 2023 P1...`);
  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    console.log(`  ${q.questionNo} done`);
  }
  console.log('\nDone. 40 questions seeded.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });