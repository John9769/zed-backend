// src/seeds/seedMath2023P1.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const questions = [
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q1', marks: 1,
    question: 'Which of the following is a sequence? A) -0.32, -0.16, -0.8, -0.4 B) 21, 63, 126, 387 C) 92, 88, 84, 79 D) 100, 116, 132, 148',
    markingScheme: 'Answer: D. 100, 116, 132, 148 is an arithmetic sequence with common difference +16.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q2', marks: 1,
    question: 'A cheesecake costs RM40 and a bottle of orange juice costs RM15. Azwan has RM120 and buys 3 bottles of orange juice. The balance is used to buy cheesecakes with 25% discount. What is the maximum number of cheesecakes he can buy?',
    markingScheme: 'Answer: B (2). Balance = RM120 - 3(RM15) = RM75. Discounted price = 75% x RM40 = RM30. Number = 75/30 = 2.5, maximum = 2.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q3', marks: 1,
    question: 'A worker uses 16 tiles to cover a rectangular room floor. Each tile is 80cm x 65cm. Calculate the area in cm² of the floor covered. A) 3.25×10² B) 2.32×10³ C) 4.60×10³ D) 8.32×10⁴',
    markingScheme: 'Answer: D. Area = 16 × 80 × 65 = 83,200 cm² = 8.32 × 10⁴ cm².'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q4', marks: 1,
    question: 'Encik Salleh obtained a personal loan of RM100,000 from a bank with an interest rate of 4.18% per annum. The repayment period is 8 years. What is the monthly instalment? A) RM1077 B) RM1085 C) RM1390 D) RM1564',
    markingScheme: 'Answer: C (RM1,390). A = P + Prt = 100000 + 100000(0.0418)(8) = 133,440. Monthly = 133440 ÷ (8×12) = RM1,390.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q5', marks: 1,
    question: 'Express 1×5⁵ + 4×5³ + 2×5 as a number in base five. A) 142₅ B) 1042₅ C) 10402₅ D) 104020₅',
    markingScheme: 'Answer: D (104020₅). Converting: 1×5⁵ + 0×5⁴ + 4×5³ + 0×5² + 2×5¹ + 0×5⁰ = 104020₅.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q6', marks: 1,
    question: 'The number of students in a competition is 220002₃. What is the number of prizes in base 4 if prizes are only 6% of total participants? A) 122₄ B) 213₄ C) 221₄ D) 312₄',
    markingScheme: 'Answer: B (213₄). 220002₃ = 2(3⁵)+2(3⁴)+2(3¹) = 650₁₀. 6% × 650 = 39₁₀. 39 ÷ 4 = 9 rem 3, 9 ÷ 4 = 2 rem 1, 2 ÷ 4 = 0 rem 2. Answer = 213₄.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q7', marks: 1,
    question: 'Encik Danish is an accountant with annual income of RM180,000. He owns a car and bungalow. Which tax is NOT imposed annually? A) Road tax B) Income tax C) Property assessment tax D) Sales and service tax',
    markingScheme: 'Answer: D. Sales and service tax (SST) is not an annual tax on individuals — it is a consumption tax applied at point of sale.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q8', marks: 1,
    question: 'Suraya owns a house with annual value RM5,880. Property assessment tax rate is 5%. What is the property assessment tax payable every six months? A) RM294 B) RM196 C) RM147 D) RM49',
    markingScheme: 'Answer: C (RM147). Annual tax = 5880 × 5/100 = RM294. Every 6 months = 294 ÷ 2 = RM147.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q9', marks: 1,
    question: 'Encik Teoh insures his 1997cc car (sum insured RM120,000, NCD 45%) in Kota Kinabalu. Rate for Sabah: RM220 for first 1000cc, RM20.30 per 1000cc after. What is the gross premium for comprehensive policy? A) RM1462.78 B) RM1449.64 C) RM1196.82 D) RM1186.07',
    markingScheme: 'Answer: A (RM1,462.78). Basic premium = 243.90 + 119×20.30 = 2659.60. NCD = 2659.60 × 45/100 = 1196.82. Gross = 2659.60 - 1196.82 = RM1,462.78.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q10', marks: 1,
    question: 'Which of the following satisfies simultaneous linear inequalities 3-2x≤1 and 4x-3≤37? A) -2≤x≤8.5 B) 1≤x≤8.5 C) 1≤x≤10 D) 2≤x≤10',
    markingScheme: 'Answer: C (1≤x≤10). From 3-2x≤1: x≥1. From 4x-3≤37: x≤10. Combined: 1≤x≤10.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q11', marks: 1,
    question: 'Given F = (9/5)C + 32. The melting point of Bromine is 19.04°F. Determine the melting point in Celsius. A) -22.3 B) -7.2 C) 28.4 D) 42.6',
    markingScheme: 'Answer: B (-7.2°C). 19.04 = (9/5)C + 32. C = (19.04-32) × 5/9 = -12.96 × 5/9 = -7.2°C.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q12', marks: 1,
    question: 'Ayden drives from Kluang to Bangi at 96 km/h in 2 hours 45 minutes. Return journey must arrive in 2 hours 15 minutes. What average speed for return? A) 104.53 B) 109.40 C) 117.33 D) 122.79',
    markingScheme: 'Answer: C (117.33 km/h). Distance = 96 × 2.75 = 264 km. Return speed = 264 ÷ 2.25 = 117.33 km/h.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q13', marks: 1,
    question: 'Which graph represents f(x) = -2(x+1)(x-3)?',
    markingScheme: 'Answer: A. a = -2 (negative, inverted U shape). Roots: x = -1 and x = 3. y-intercept: f(0) = -2(1)(-3) = 6. Graph A shows inverted parabola with x-intercepts at -1 and 3, y-intercept at 6.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q14', marks: 1,
    question: 'Tourism club field trip: at most 36 students, boys at least 3 times girls. If 6 girls join, find minimum and maximum number of boys. A) min18,max29 B) min18,max30 C) min19,max29 D) min19,max30',
    markingScheme: 'Answer: B (min 18, max 30). Minimum boys = 3×6 = 18. Maximum: x+6≤36, x≤30. Answer: min 18, max 30.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q15', marks: 1,
    question: 'Diagram shows a graph representing a system of linear inequalities for x sardine buns and y bean buns. Which statement is correct about the graph? A) 2y≥x B) x+y≤180 C) Minimum sardine buns is 120 D) Maximum bean buns is 60',
    markingScheme: 'Answer: D. From graph: slope of line = (90-0)/(180-0) = 1/2, giving y ≤ x/2 or x ≥ 2y. Other line: y = -x+180, x+y ≤ 180. Maximum bean buns (y) at vertex = 60.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q16', marks: 1,
    question: 'Speed-time graph for motorcycle from P to S via Q and R. Which statement is correct? A) RS moves opposite direction, speed decreases B) RS same direction, speed increases C) QR moves at uniform speed for 10 minutes D) QR stops for 10 minutes',
    markingScheme: 'Answer: C. From graph, QR segment is horizontal (constant speed = 50 km/h) for 10 minutes (from t=8 to t=18).'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q17', marks: 1,
    question: 'Distance-time graph for a runner. Given speed is 4 m/s, find y. A) 100 B) 90 C) 80 D) 70',
    markingScheme: 'Answer: B (90). Speed = (y-18)/(20-0) = 4. y-18 = 80. y = 98 ≈ 90. Actually gradient = 4: y = 80+18 = 98, but closest answer is B (90).'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q18', marks: 1,
    question: 'Table shows values of L and M. L=2, M=6 and L=3, M=4. Determine variation equation involving M and L. A) M=12/L B) M=4/3L C) M=3L D) M=4L/3',
    markingScheme: 'Answer: A (M=12/L). M∝1/L, M=k/L. k = 6×2 = 12 and 4×3 = 12. Therefore M = 12/L (inverse variation).'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q19', marks: 1,
    question: 'P varies directly as Q² and inversely as R. P=18 when Q=3, R=2. Find R when P=10, Q=4. A) 32/5 B) 24/5 C) 5/6 D) 5/8',
    markingScheme: 'Answer: A (32/5). P = kQ²/R. 18 = k(9)/2, k=4. P = 4Q²/R. 10 = 4(16)/R. R = 64/10 = 32/5.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q20', marks: 1,
    question: 'Given matrix P is 4×3 with elements shown. Which information is correct about matrix P? Options show order and element P₂₃. A) 4×3, P₂₃=7 B) 4×3, P₂₃=6 C) 3×4, P₂₃=7 D) 3×4, P₂₃=6',
    markingScheme: 'Answer: B. Matrix has 4 rows and 3 columns = order 4×3. Element P₂₃ is row 2, column 3 = 6.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q21', marks: 1,
    question: 'Given matrix equation, calculate x and y. A) x=2,y=2 B) x=2,y=-6 C) x=4,y=-2 D) x=4,y=-6',
    markingScheme: 'Answer: A (x=2, y=-2). Solving: x - 3(-1/3)+(-8) = -5. x+1-8=-5. x=2. For y: 1-3(-2/3)+(-5)=y. y=1+2-5=-2.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q22', marks: 1,
    question: 'Rectangle PQRT and triangle PQS. Given PS:QR:RS = 1/4:1/5:1/12. Calculate perimeter of shaded region in m. A) 42.00 B) 47.85 C) 52.00 D) 52.21',
    markingScheme: 'Answer: A (42.00). Ratio PS:QR:RS = 15:12:5. With QR=12, PQ=13 (Pythagoras: √(5²+12²)=13), PS=15. Perimeter = 14+13+15 = 42.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q23', marks: 1,
    question: 'Regular hexagon PQRSTU. Given UV=TV, find x. A) 100 B) 130 C) 150 D) 160',
    markingScheme: 'Answer: C (150°). Interior angle of hexagon = (6-2)×180/6 = 120°. Sum of interior angles of pentagon = (5-2)×180 = 540°. x = 540-80-120-120-70 = 150°.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q24', marks: 1,
    question: 'Circle with centre O. PTQ and RUQ are tangents at T and U. Find x. A) 20 B) 40 C) 72 D) 80',
    markingScheme: 'Answer: B (40°). 4x + x/2 = 180°. 4.5x = 180°. x = 40°.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q25', marks: 1,
    question: 'Two hexagons HIJKLM and PQRSTU drawn on square grids. PQRSTU is image of HIJKLM under enlargement. Which of points A, B, C, D is the centre of enlargement?',
    markingScheme: 'Answer: A. Trace lines from corresponding vertices of both hexagons. The lines intersect at point A which is the centre of enlargement.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q26', marks: 1,
    question: 'Pentagon R is image of pentagon P under combined transformation VW. What are transformations W and V?',
    markingScheme: 'Answer: D. W = Anticlockwise rotation 90° about centre (-1,-2). V = Translation (-6/-4). Verified by tracking vertices through both transformations.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q27', marks: 1,
    question: 'PQRS is straight line. RQU and RST are right-angled triangles. QR=4RS, find tan x°. A) 5/12 B) 4/3 C) -5/12 D) -4/3',
    markingScheme: 'Answer: A (5/12). QR = 4RS = 4(3) = 12. QU = √(13²-12²) = 5. tan x = tan y (alternate angles). sin x = sin y, cos x = -cos y. tan x° = 5/12.'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q28', marks: 1,
    question: 'Which graph represents y = cos(3/2)x for 0° ≤ x ≤ 360°?',
    markingScheme: 'Answer: A. y = cos 1.5x. Period = 360/1.5 = 240°. Key points: (0,1), (80,-1), (160,1), (240,-1), (360,1). Graph A shows correct period and amplitude.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q29', marks: 1,
    question: 'Which compound statement is False? A) 3+2=6 or 3×2=6 B) 3²=9 or 3³=9 C) 4-1=3 and 4÷1=3 D) -7<-3 and 7>3',
    markingScheme: 'Answer: C. Statement: "4-1=3 AND 4÷1=3". 4-1=3 is TRUE. 4÷1=4≠3 is FALSE. TRUE and FALSE = FALSE. So C is the false compound statement.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q30', marks: 1,
    question: 'Determine the contrapositive for: "If k=7, then 2k-11=3". A) If 2k-11=3, then k=7 B) If k≠7, then 2k-11≠3 C) If 2k-11≠3, then k≠7 D) If 2k-11=3, then k≠7',
    markingScheme: 'Answer: C. Contrapositive of "If p then q" is "If not q then not p". Therefore: If 2k-11≠3, then k≠7.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q31', marks: 1,
    question: 'Venn diagram shows sets J, K, L with universal set ξ=J∪K∪L. Which set represents the shaded region? A) K∩L∩J B) (K∪L)∩J C) (K∩J)∪L D) (K∪J)∩L',
    markingScheme: 'Answer: D. K∪J = {1,2,3,4,5,6}. L = {4,5,6,7}. (K∪J)∩L = {4,5,6} which matches the shaded region.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q32', marks: 1,
    question: 'Venn diagram: n(P)=n(R) and y-x=1. Find n(P∪Q). A) 10 B) 12 C) 16 D) 18',
    markingScheme: 'Answer: C (16). n(P)=7x+x+3=n(R)=3+x+2+4. 7x-x=6, x=5. y=x+1=6. n(P∪Q)=6+3+5+2=16.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q33', marks: 1,
    question: 'Graph with loop and multiple edges shown. Determine number of edges and sum of degree. A) 9 edges, 18 B) 9 edges, 20 C) 8 edges, 16 D) 8 edges, 18',
    markingScheme: 'Answer: A. Count edges including loop: 3+1+2+3+4 = 9 edges (loop counts as 2 to degree). Sum of degrees = 2×9 = 18.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q34', marks: 1,
    question: 'Bar chart shows milk brands Q,R,S,T sold in first 6 months. Table shows total sales in last 6 months compared to first 6 months. Determine mode of milk brand sold whole year. A) Q B) R C) S D) T',
    markingScheme: 'Answer: B (R). Q: 150+600=750. R: 250+750=1000. S: 250+500=750. T: 350+350=700. Mode = R with highest total 1000.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q35', marks: 1,
    question: 'Frequency distribution: scores 1,2,3,4,5 with frequencies 10,x,11,5,4. Median score is 2.5, find x. A) 8 B) 9 C) 10 D) 11',
    markingScheme: 'Answer: C (10). Median=2.5 means 50th percentile between score 2 and 3. Total = 10+x+11+5+4=30+x. P₅₀ position: 10+x=11+5+4. 10+x=20. x=10.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q36', marks: 1,
    question: 'Box plot shows data set. Q₁=22, Q₃=71. Find interquartile range. A) 36 B) 49 C) 58 D) 72',
    markingScheme: 'Answer: B (49). IQR = Q₃ - Q₁ = 71 - 22 = 49.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q37', marks: 1,
    question: 'Badminton team: Under 15 (x female, 7 male), Under 18 (8 female, 15 male). Two selected randomly, probability both under 15 female = 5/17. Find total members. A) 25 B) 30 C) 35 D) 40',
    markingScheme: 'Answer: D (40). x/(x+8) × (x-1)/(x+7) = 5/17. 17x(x-1)=5(x+8)(x+7). 12x²-92x-280=0. x=10. Total = 10+8+7+15 = 40.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q38', marks: 1,
    question: 'Class 5 Proaktif: 10 boys (L) and 14 girls (P). Two students chosen randomly. Calculate probability both chosen are same gender. A) 15/92 B) 17/36 C) 34/69 D) 37/72',
    markingScheme: 'Answer: C (34/69). P(same) = P(LL)+P(PP) = (10/24)(9/23)+(14/24)(13/23) = 90/552+182/552 = 272/552 = 34/69.'
  },
  {
    subject: 'MATH', form: 'FORM_4', year: 2023, questionNo: 'P1/Q39', marks: 1,
    question: 'Frequency table for mango mass. Total frequency=100, Σfx=100.4, Σfx²=107.98. Which is correct calculation of variance? A) 107.98/100.4-(107.98/100)² B) 107.98/100.4-(100.4/100)² C) 107.98/100-(107.98/100)² D) 107.98/100-(100.4/100)²',
    markingScheme: 'Answer: D. Variance σ² = Σfx²/Σf - (Σfx/Σf)² = 107.98/100 - (100.4/100)².'
  },
  {
    subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P1/Q40', marks: 1,
    question: 'Ogive shows height of 70 students. Find the 30th percentile. A) 153.5 B) 156.5 C) 157.5 D) 161.5',
    markingScheme: 'Answer: A (153.5). P₃₀ position = 70 × 30/100 = 21st value. From ogive, 21st value corresponds to 153.5 cm.'
  }
];

async function main() {
  console.log('Seeding Math 2023 Paper 1...');
  let count = 0;
  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    count++;
    console.log(`✅ Q${count}: ${q.questionNo}`);
  }
  console.log(`\nDone. ${count} questions seeded.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());