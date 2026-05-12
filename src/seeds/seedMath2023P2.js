const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedMath2023P2() {
  const questions = [
    {
      subject: 'MATH',
      form: 'FORM_5',
      year: 2023,
      questionNo: 'P2-A-Q1',
      marks: 4,
      question: `Diagram 1 shows a stem-and-leaf plot for time taken by students in a survey.
Stem | Leaf
 1   | 5 8
 2   |
 3   | 2 5 7
 4   | 4 5 6 6 7
 5   | 2 4
Key: 1|5 means 15 minutes
(a) State the number of students who took part in the survey.
(b) Determine the mode of distribution.
(c) Write one inference based on the distribution of the time.`,
      markingScheme: `(a) 12 students [1m]
(b) Mode = 46 minutes (appears twice) [1m]
(c) e.g. Most students took 40-49 minutes / No student took 20-29 minutes [2m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q2', marks: 4,
      question: `(a) Complete Table 1 for y = 2x^2 - 3, for -3 <= x <= 3.
x | -3 | -2.5 | -1.5 | 0  | 1 | 2 | 3
y | 15 |      |      | -3 |   |   | 15
(b) Draw the graph of y = 2x^2 - 3 for -3 <= x <= 3.`,
      markingScheme: `(a) x=-2.5: y=9.5 | x=-1.5: y=1.5 | x=1: y=-1 | x=2: y=5 [2m]
(b) Smooth U-shaped parabola, minimum at (0,-3), symmetrical about y-axis. [2m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q3', marks: 3,
      question: `Diagram 2 shows straight line PQ and point T. P(-2,2), Q(3,4), T(1,-1).
Find the equation of the straight line parallel to PQ passing through T.`,
      markingScheme: `Gradient PQ = (4-2)/(3-(-2)) = 2/5 [1m]
y+1 = (2/5)(x-1) -> 5y = 2x - 7 [1m]
Answer: y = (2/5)x - 7/5  or  5y = 2x - 7 [1m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q4', marks: 5,
      question: `(a) Complete the deductive argument:
Premise 1: All acidic substances have pH < 7.
Premise 2: Apple vinegar is an acidic substance.
Conclusion: ..............
(b)(i) Encik Jamal savings: Jan=RM600, Feb=RM915, Mar=RM1230, Apr=RM1545, May=RM1860.
By induction, write conclusion for amount RMy at end of month x.
(b)(ii) Holiday costs RM3500. Calculate number of months needed.`,
      markingScheme: `(a) Apple vinegar has a pH value less than 7. [1m]
(b)(i) Difference = 315/month. y = 315x + 285 [2m]
(b)(ii) 315x + 285 = 3500 -> x = 10.2 -> 11 months [2m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q5', marks: 5,
      question: `Table 3: competitions (Colouring=C, Singing=S, Cooking=K):
All 3: 5 | S only: 6 | C only: 12 | C&S: 9 | K&S: 15 | Total C: 30 | Total K: 35
(a) Complete the Venn diagram.
(b)(i) Number of students who joined one competition only.
(b)(ii) Number who did NOT join both C and K.`,
      markingScheme: `Working: C n S only=4, K n S only=10, C n K only=9, K only=11. Total=57.
(a) Venn: Only C=12, S=6, K=11, CnS=4, KnS=10, CnK=9, centre=5. [2m]
(b)(i) 12+6+11 = 29 [1m]
(b)(ii) CnK=14. NOT both = 57-14 = 43 [2m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q6', marks: 4,
      question: `Diagram 4: speed-time graph for a car.
0-10s: 0 to 13 m/s | 10-20s: 13 to 17 m/s | 20-25s: constant 17 m/s | 25-50s: 17 to 0 m/s
(a) Describe the motion between 20th and 25th second.
(b) Calculate total distance during acceleration and deceleration.`,
      markingScheme: `(a) Uniform speed of 17 m/s for 5 seconds. [1m]
(b) Acceleration (0-20s): (1/2)(10)(13) + (1/2)(13+17)(10) = 65+150 = 215 m [1.5m]
Deceleration (25-50s): (1/2)(25)(17) = 212.5 m [1m]
Total = 427.5 m [0.5m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q7', marks: 4,
      question: `Helen insurance 2022: Annual limit RM200,000 | Deductible RM1,500 | Co-insurance 85/15.
(a) Treatment cost RM1,050. Would insurer bear the cost? Explain.
(b) Surgery cost RM29,900. Calculate cost borne by Helen.`,
      markingScheme: `(a) NO. RM1,050 < deductible RM1,500. Helen pays full amount herself. [2m]
(b) After deductible: 29,900-1,500 = RM28,400. Helen 15% = RM4,260.
Total by Helen = 1,500+4,260 = RM5,760 [2m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q8', marks: 4,
      question: `Julia sells x curry puffs and y cup cakes. Conditions:
(i) x+y <= 50  (ii) x < 30  (iii) Minimum cup cakes = 10.
(a) Write linear inequality for condition (iii).
(b) Complete graph and shade feasible region.`,
      markingScheme: `(a) y >= 10 [1m]
(b) Draw solid line y=10. Shade region satisfying x+y<=50, x<30, y>=10, x>=0, y>=0. [3m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q9', marks: 4,
      question: `Equilateral triangle ABC: A(3,5), B(1,1), C(5,1). P=midpoint BC=(3,1), Q=midpoint AC=(4,3), R=midpoint AB=(2,3).
(a) Are triangles APB and BQC congruent? Justify.
(b) Triangle PQR is image of ABC under a single transformation. Describe fully.`,
      markingScheme: `(a) YES. AP=BQ, PB=QC (half equal sides), AB=BC. By SSS. [2m]
(b) Enlargement, scale factor -1/2, centre (3, 7/3). [2m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q10', marks: 4,
      question: `Puan Ilham annual income 2022: RM69,200.
Tax relief: RM18,500 | Tax exemption: RM470 | Tax rebate: RM1,260.
(a) She subtracts ALL three from income to get chargeable income. Correct? Explain.
(b) Using tax table (band RM50,001-70,000: first RM50,000 = RM1,800; next at 13%), calculate income tax payable.`,
      markingScheme: `(a) NOT correct. Tax rebate deducts from tax payable, not from income.
Chargeable income = 69,200-18,500-470 = RM50,230. [2m]
(b) Tax on RM50,000 = RM1,800. Tax on RM230 = 13% x 230 = RM29.90.
Gross tax = RM1,829.90. Less rebate = 1,829.90-1,260 = RM569.90 [2m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q11', marks: 9,
      question: `(a) State two types of financial goals.
(b) Encik Rasheed monthly: Income = Active RM4,322 + Passive RM500.
Fixed: Housing RM900, Car RM600, Insurance RM200.
Variable: Utility RM180, Food RM550, Petrol RM350, Phone RM200.
(i) Determine cash flow and state the type.
(ii) Goal: marry within a year. Needs RM10,850 dowry + RM13,000 wedding.
(a) Calculate difference between monthly savings needed and cash flow in b(i).
(b) Suggest two changes to achieve his goal.`,
      markingScheme: `(a) Any two: Short-term / Medium-term / Long-term financial goal. [2m]
(b)(i) Income=RM4,822. Expenses=RM2,980. Cash flow=RM1,842. Positive cash flow. [2m]
(b)(ii)(a) Monthly needed = 23,850/12 = RM1,987.50. Diff = 1,987.50-1,842 = RM145.50 [2m]
(b)(ii)(b) e.g. Reduce food/petrol expenses / Increase passive income. [3m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q12', marks: 9,
      question: `Table 8 - supermarket customers:
Expenditure(RM) | Day1 | Day2
70-79  | 3 | 2 | 80-89 | 5 | 4 | 90-99 | 10 | 3
100-109 | 20 | 8 | 110-119 | 12 | 14 | 120-129 | 7 | 20 | 130-139 | 6 | x
(a)(i) State class interval size and range.
(a)(ii) Find x if Day 2 total = 68.
(b) Draw Day 2 frequency polygon on same graph as Day 1.
(c)(i) State distribution shape for both days.
(c)(ii) Which day had special sale? Justify.`,
      markingScheme: `(a)(i) Class interval = 10. Range = 69. [2m]
(a)(ii) 51+x=68 -> x=17 [1m]
(b) Midpoints: (74.5,2),(84.5,4),(94.5,3),(104.5,8),(114.5,14),(124.5,20),(134.5,17). Connect with lines. [3m]
(c)(i) Day 1: positively skewed. Day 2: negatively skewed. [2m]
(c)(ii) Day 2. Negatively skewed = more customers spent higher amounts due to special sale. [1m+1m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q13', marks: 9,
      question: `5 friends activities - Bowling: Fahad,Suzi,Mei,Suria | Badminton: Pandian,Mei,Suzi | Hiking: Suria,Pandian,Fahad.
Incomplete graph: P(top)=Badminton, Q(bottom-left), R(bottom-right). Edges: Suria(P-Q), Suzi(P-R), m, n, k.
(a)(i) State label for vertex Q.  (a)(ii) State label for edge k.
(b) Malacca tour. Places: Zoo(Z), Bee Farm(B), Klebang Beach(K), A Famosa(A), Hang Tuah Well(P), River Cruise(R).
Distances(km): R-Z=11.2, R-B=10.9, K-Z=18.4, Z-B=10.1, K-R=9.4, A-K=9.2, B-A=12.5, P-R=7.2, A-P=6.2, B-P=7.5.
(i) Draw undirected weighted graph.
(ii) Draw minimum spanning tree.
(iii) List two shortest routes Z to K via P.`,
      markingScheme: `(a)(i) Q = Bowling [1m]
(a)(ii) k = Fahad or Suria (both do Bowling AND Hiking) [1m]
(b)(i) 6 vertices, 10 edges, correct weights. [2m]
(b)(ii) MST: A-P(6.2), P-R(7.2), B-P(7.5), A-K(9.2), Z-B(10.1). Total=40.2km [2m]
(b)(iii) Route 1: Z-B-P-A-K = 33.0km. Route 2: Z-R-P-A-K = 33.8km [3m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q14', marks: 9,
      question: `Watershed depth cycle (period=4h). Starts 2m at t=0, max 3m at t=1h, min 1m at t=3h.
(a)(i) State minimum level in m.
(a)(ii) State duration gate is open in hours.
(b)(i) Write equation in form y = a sin bx + c.
(b)(ii) Find depth when time = 150 minutes.
(c) Rainy season: cycle every 2 hours.
(i) Complete the graph.
(ii) Explain what frequency difference means in context.`,
      markingScheme: `(a)(i) 1 m [1m]
(a)(ii) Gate open t=1 to t=3 = 2 hours [1m]
(b)(i) a=1, b=90, c=2. y = sin(90x) + 2 [3m]
(b)(ii) t=2.5h. y = sin(225)+2 = -0.707+2 = 1.29 m [2m]
(c)(i) Same amplitude/midline, period=2h, two complete cycles in 4h. [1m]
(c)(ii) Higher frequency = gate opens/closes twice as often. Watershed fills and drains faster due to heavier rain. [1m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q15', marks: 9,
      question: `(a) Given [7,-2;x+3,4] = [7,5y;-1,4]. Find x and y.
(b)(i) Lily: 3 sushi + 2 chicken = RM55. Kelly: 4 sushi + 3 chicken = RM75. Using matrix method, find prices.
(b)(ii) Sushi 20% OFF, Chicken 40% OFF. Jane has RM50, wants 2 sushi + 8 chicken. Enough? Justify using matrix multiplication.`,
      markingScheme: `(a) x=-4, y=-2/5 [2m]
(b)(i) [3,2;4,3][s;f]=[55;75]. Det=1. Inverse=[3,-2;-4,3].
[s;f]=[15;5]. Sushi=RM15, Chicken=RM5. [4m]
(b)(ii) Discounted: Sushi=RM12, Chicken=RM3.
[2,8][12;3] = 24+24 = RM48 <= RM50. YES, enough. [3m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-C-Q16', marks: 15,
      question: `Archery coach Sirhan.
(a)(i) Name the shape formed by three posts P, Q, R (right angle at Q).
(a)(ii) Calculate PR if PQ=2.5m and QR=6.0m.
(b) P(Zarif advances)=3/5. P(Syafi advances)=4/9. Find P(Zarif OR Syafi advances).
(c) Arrow path: f(x) = -(13/200)x^2 + (39/20)x. M and N are 1.2m above ground. Find maximum height from ground.
(d) Zarif: mean=7.542, SD=1.233. Syafi scores: Score 6,7,8,9,10 | Freq 19,21,24,6,2.
Calculate Syafi mean and SD. Compare both archers on average and consistency.`,
      markingScheme: `(a)(i) Right-angled triangle [1m]
(a)(ii) PR^2=2.5^2+6^2=42.25. PR=6.5m [2m]
(b) 3/5+4/9-(3/5)(4/9) = 27/45+20/45-12/45 = 35/45 = 7/9 [3m]
(c) Max at x=15. f(15)=14.625m. Height from ground=14.625+1.2=15.825m [3m]
(d) n=72. Mean=527/72=7.319. SD=sqrt(3935/72-7.319^2)=1.042.
Zarif better average (7.542>7.319). Syafi more consistent (SD 1.042<1.233). [6m]`
    },
    {
      subject: 'MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-C-Q17', marks: 15,
      question: `Water rocket competition.
(a)(i) Path = f(x)=ax^2+bx+c. State range of a.
(a)(ii) Max height 5m, lands 8m from launch. State coordinates of maximum point.
(b) Production costs: RM15-19(5 teams), RM20-24(3), RM25-29(6), RM30-34(2). Calculate SD.
(c) Bottle = hemisphere+cylinder+cone, radius=5cm, cylinder h=20cm, cone h=5cm (cone at bottom).
1/3 of volume filled with water. Calculate h (water height from bottom of cone). Use pi=22/7.
(d) l=(u^2/g)(2 sin theta cos theta). u=20, g=10. Without calculator, which is better: 30 or 45 degrees?`,
      markingScheme: `(a)(i) a < 0 [1m]
(a)(ii) Max at x=8/2=4. Maximum point = (4,5) [2m]
(b) Mean=377/16=23.5625. Var=27.246. SD=5.22 [3m]
(c) Total V=38500/21 cm^3. 1/3 V=38500/63.
Cone full=2750/21. Remaining in cylinder=(550/7)h_c=30250/63 -> h_c=20/3.
h = 5+20/3 = 35/3 cm [5m]
(d) l=40sin(2theta). At 30: 20root3 m. At 45: 40m. 45 degrees is better. [4m]`
    },
  ];

  console.log(`Seeding ${questions.length} questions — MATH 2023 P2...`);
  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    console.log(`  ${q.questionNo} done`);
  }
  console.log('\nDone. 17 questions seeded.');
}

seedMath2023P2()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });