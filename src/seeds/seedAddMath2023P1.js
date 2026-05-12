const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = [
    // SECTION A
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q1', marks: 3,
      question: `Four consecutive terms of a sequence are 50, 45, x and y. State the value of:
(a) y - x if the sequence is an arithmetic progression.
(b) y/x if the sequence is a geometric progression.`,
      markingScheme: `(a) AP: d = 45-50 = -5. x = 40, y = 35. y - x = 35 - 40 = -5 [1m]
(b) GP: r = 45/50 = 9/10. y/x = r^2 = (9/10)^2 = 81/100 [2m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q2', marks: 3,
      question: `Diagram 1 shows two straight lines y = qx and x/6 + y/p = 1 on a Cartesian plane. The line x/6 + y/p = 1 has y-intercept at (0, 2).
Find the value of q.`,
      markingScheme: `y-intercept of x/6 + y/p = 1 at (0,2): p = 2. [1m]
Line becomes x/6 + y/2 = 1, gradient = -1/3.
Lines are perpendicular: q = 3. [2m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q3', marks: 4,
      question: `Diagram 2 shows two straight lines L1 and L2 drawn based on five plotted points on a plane 1/y against x^2. Points (2,4) and (6,7) are plotted.
(a) Which straight line is a suitable line of best fit? Give a reason.
(b) Given that (10, 9) lies on the line of best fit, express y in terms of x.`,
      markingScheme: `(a) L2. Reason: L2 has equal number of points on both sides / L2 passes through or closest to most points. [1m]
(b) Using (2,4) and (10,9): gradient = (9-4)/(10-2) = 5/8.
1/y = (5/8)x^2 + c. At (2,4): c = 4 - 5/4 = 11/4.
1/y = (5/8)x^2 + 11/4 -> y = 8/(5x^2 + 22). [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q4', marks: 3,
      question: `Diagram 3 shows point A(-p, q) on the circumference of a unit circle. Angle beta is shown.
Express in terms of p and/or q:
(a) tan beta
(b) cot(180 + beta)`,
      markingScheme: `Unit circle: p^2 + q^2 = 1. A is in second quadrant (x=-p, y=q).
(a) tan beta = q/(-p) = -q/p [1m]
(b) cot(180+beta) = cos(180+beta)/sin(180+beta) = (-cos beta)/(-sin beta) = cot beta = -p/q [2m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q5', marks: 5,
      question: `Diagram 4 shows three points on a Cartesian plane: P(-1,5), S(1,2), Q (unknown).
(a) State vector SP.
(b) Given PQ = 5i + mj:
(i) If SP + 3PQ = 13i + 15j, find m using vector arithmetic.
(ii) Hence, determine the unit vector in the direction of PQ.`,
      markingScheme: `(a) SP = P - S = (-1-1, 5-2) = -2i + 3j [1m]
(b)(i) SP + 3PQ = (-2+15)i + (3+3m)j = 13i + 15j.
3 + 3m = 15 -> m = 4 [2m]
(b)(ii) PQ = 5i + 4j. |PQ| = sqrt(25+16) = sqrt(41).
Unit vector = (5i + 4j)/sqrt(41) = (5/sqrt(41))i + (4/sqrt(41))j [2m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q6', marks: 5,
      question: `(a) Diagram 5 shows graph of f(x) = |x-3| + 1 for domain -2 <= x <= 7. Value h is marked on the y-axis. Find the value of the other object of h.
(b) Given functions f: x -> 4x-1 and g: x -> 2x+3, find:
(i) value of p if f^(-1)(p) = 2
(ii) value of x if fg(x) = 5f(2)`,
      markingScheme: `(a) f(7) = |7-3|+1 = 5, so h = 5.
Other object: |x-3| + 1 = 5 -> |x-3| = 4 -> x = 7 or x = -1. Other object = x = -1. [2m]
(b)(i) f^(-1)(p) = 2 -> f(2) = p -> p = 4(2)-1 = 7 [1m]
(b)(ii) f(2) = 7. 5f(2) = 35.
fg(x) = f(2x+3) = 4(2x+3)-1 = 8x+11.
8x+11 = 35 -> x = 3 [2m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q7', marks: 8,
      question: `(a) Diagram 6: curve y = -2x^2 + 3x + p and tangent y = -x + c. Express p in terms of c.
(b) Find the range of values of x for (x+1)(-3x-3) < x-1 using the table method.
(c) Given that p and 2p are roots of 2x^2 + 6x + 4p^2 = 0. Find the quadratic equation with roots (p-1) and (p+1).`,
      markingScheme: `(a) dy/dx = -4x+3 = -1 (tangent gradient) -> x = 1.
At x=1 on curve: y = -2+3+p = 1+p.
At x=1 on tangent: y = -1+c.
1+p = -1+c -> p = c-2 [2m]
(b) -3(x+1)^2 < x-1 -> 3x^2+7x+2 > 0 -> (3x+1)(x+2) > 0.
Table method: x < -2 or x > -1/3 [3m]
(c) Sum of roots p+2p = -6/2 -> 3p = -3 -> p = -1.
New roots: p-1 = -2, p+1 = 0.
Sum = -2, product = 0.
Equation: x^2 + 2x = 0 [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q8', marks: 5,
      question: `A cylindrical wooden block is cut into n pieces. Sector angles form an AP increasing by a constant amount. The 4th piece angle = 3 x smallest piece angle. Sum of first 4 sector angles = 72 degrees.
(a) Find the angle of the sector for the smallest piece.
(b) Find the value of n.
Note: Listing out all terms is NOT accepted.`,
      markingScheme: `Let smallest angle = a, common difference = d.
4th term = a+3d = 3a -> d = 2a/3.
Sum of first 4: 4a + 6d = 72 -> 4a + 4a = 72 -> a = 9 degrees. [2m]
(b) d = 6. Sum of all n sectors = 360.
(n/2)(2(9)+(n-1)(6)) = 360
n(12+6n)/2 = 360
6n^2 + 12n - 720 = 0
n^2 + 2n - 120 = 0
(n-10)(n+12) = 0
n = 10 [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q9', marks: 8,
      question: `(a) Given 2^x = 8^y = sqrt(2^(3z)), find x:y:z.
(b) Given 9^(2pq+1) + 3^(4pq-3) = 732, express p in terms of q.
(c) Find the value of 1/log_a(ab) + 1/log_b(ab).`,
      markingScheme: `(a) 2^x = 8^y = 2^(3y). x = 3y.
sqrt(2^(3z)) = 2^(3z/2). x = 3z/2. z = 2x/3.
x:y:z = x:x/3:2x/3 = 3:1:2 [3m]
(b) 3^(4pq+2) + 3^(4pq-3) = 732.
Let u = 3^(4pq-3): 3^5·u + u = 732 -> 244u = 732 -> u = 3.
4pq-3 = 1 -> pq = 1 -> p = 1/q [3m]
(c) 1/log_a(ab) + 1/log_b(ab) = log_(ab)(a) + log_(ab)(b) = log_(ab)(ab) = 1 [2m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q10', marks: 9,
      question: `Solutions using other than calculus are NOT accepted.
(a) Mus bought spherical balls with radius 5 cm. Arranged on a rack 2.5 m long. On Monday, each ball's volume decreased uniformly by 20pi cm^3. Find maximum number of balls on rack on Monday. [4 marks]
(b) Given h(x) = 3x^2 + 7x - 8, determine the type of turning point. Justify. 
(c) Gradient function of a curve is (2x+1)^3. Curve passes through (1/2, 5). Find equation in form y = a(2x+1)^b + c where a, b, c are constants.`,
      markingScheme: `(a) Original V = (4/3)pi(5)^3 = 500pi/3. Monday V = 500pi/3 - 20pi = 440pi/3.
New r^3 = (440pi/3)/(4pi/3) = 110. New diameter = 2(110)^(1/3) cm.
(110)^(1/3) approx 4.791. Diameter approx 9.582 cm.
Max = floor(250/9.582) = 26 balls. [4m]
(b) h'(x) = 6x+7 = 0 -> x = -7/6. h''(x) = 6 > 0. Minimum turning point. [2m]
(c) y = INT(2x+1)^3 dx = (2x+1)^4/8 + c.
At (1/2, 5): 5 = (2)^4/8 + c = 2+c. c = 3.
y = (1/8)(2x+1)^4 + 3. [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q11', marks: 8,
      question: `(a) Probability a product can be sold = 19/20. Company produces 820 units in a month. Find the mean and standard deviation of products expected to be sold. [3 marks]
(b) 25 students in a class.
(i) Number of ways choosing r students = number of ways choosing (r+13) students. Find r.
(ii) Teacher selects 8 students (equal boys and girls) to join a game. Arrange in a row such that boys are not next to each other. Find number of different ways.`,
      markingScheme: `(a) X ~ B(820, 19/20). Mean = 820(19/20) = 779.
SD = sqrt(820 x 19/20 x 1/20) = sqrt(38.95) = 6.24 [3m]
(b)(i) C(25,r) = C(25,r+13). r + (r+13) = 25 -> 2r = 12 -> r = 6 [2m]
(b)(ii) 4 boys + 4 girls.
Arrange 4 girls: 4! = 24 ways.
Insert 4 boys in 5 gaps: P(5,4) = 5!/1! = 120 ways.
Total = 24 x 120 = 2880 ways [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-A-Q12', marks: 5,
      question: `A farm produces strawberries. Mass X grams ~ N(20, 0.5^2).
(a) State the mean and variance of the distribution. [1 mark]
(b) Diagram 8 shows standard normal distribution. Shaded region represents P(|Z| < k). Unshaded tails each represent p%.
(i) Express m in terms of alpha (where X is between (-alpha+40) and alpha grams).
(ii) Find value of alpha when P(|Z| < k) = 0.2662.`,
      markingScheme: `(a) Mean = 20, Variance = 0.25 [1m]
(b)(i) Standardize: k = (alpha-20)/0.5 = 2alpha-40.
m = -k = 40-2alpha. [2m]
(b)(ii) P(|Z|<k) = 0.2662 -> P(0<Z<k) = 0.1331 -> k = 0.34.
2alpha-40 = 0.34 -> alpha = 20.17. [2m]`
    },

    // SECTION B (answer any 2)
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-B-Q13', marks: 8,
      question: `(a) Express y in terms of x and/or e:
(i) 6 ln y = sqrt(5) ln x
(ii) ln(x + y^2) - 3 = 0
(b) Diagram 9: semicircle ABCD. AD = (x + 2sqrt(2)) cm is the diameter. Chord BC = (x*sqrt(2) - 1) cm. Ratio of radius to chord length = 6:1. Find value of x in the form a + b*sqrt(2) where a and b are rational numbers.`,
      markingScheme: `(a)(i) 6 ln y = sqrt(5) ln x -> ln y^6 = ln x^sqrt(5) -> y^6 = x^sqrt(5) -> y = x^(sqrt(5)/6) [2m]
(a)(ii) ln(x+y^2) = 3 -> x+y^2 = e^3 -> y = sqrt(e^3 - x) [2m]
(b) Radius = (x+2sqrt(2))/2. BC = x*sqrt(2)-1.
radius/chord = 6/1: (x+2sqrt(2))/2 = 6(x*sqrt(2)-1)
x+2sqrt(2) = 12x*sqrt(2)-12
x(1-12sqrt(2)) = -12-2sqrt(2)
x = (12+2sqrt(2))/(12sqrt(2)-1)
Rationalize by (12sqrt(2)+1):
x = (12+2sqrt(2))(12sqrt(2)+1)/287
= (144sqrt(2)+12+48+2sqrt(2))/287
= (60+146sqrt(2))/287 = 60/287 + (146/287)sqrt(2) [4m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-B-Q14', marks: 8,
      question: `Given f(x) = 2x - 5 and gf(x) = 4/(2x-5), x != h.
(a) State the value of h.
(b) Find the value of x when f(x) maps onto itself.
(c) Find:
(i) g(x)
(ii) g^(4n-3)(x)`,
      markingScheme: `(a) gf(x) defined for 2x-5 != 0 -> x != 5/2. h = 5/2 [1m]
(b) f(x) = x -> 2x-5 = x -> x = 5 [1m]
(c)(i) Let u = 2x-5. g(u) = 4/u. Therefore g(x) = 4/x [2m]
(c)(ii) g(x) = 4/x. g^2(x) = g(4/x) = 4/(4/x) = x.
Pattern: odd powers -> 4/x, even powers -> x.
4n-3 is always odd (for all positive integers n).
g^(4n-3)(x) = 4/x [4m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P1-B-Q15', marks: 8,
      question: `Table 1 shows x values for y + 3sin(3x/2) = 1 where 0 <= x <= 2pi.
x values: 0, pi/6, pi/3, pi/2, 2pi/3, 5pi/6, pi, 7pi/6, 4pi/3, 3pi/2, 5pi/3, 11pi/6, 2pi.
(a) Complete the y values in Table 1.
(b) Using scale 3cm to pi/3 on x-axis and 2cm to 1 unit on y-axis, draw the graph of y + 3sin(3x/2) = 1 for 0 <= x <= 2pi.
(c)(i) State a suitable straight line equation to solve 3sin(3x/2) = 4x/pi - 2.
(ii) Draw the line on your graph and state the value(s) of x in terms of pi.`,
      markingScheme: `(a) y = 1 - 3sin(3x/2). Values:
x=0: y=1 | x=pi/6: y=1-3(sqrt2/2)=-1.12 | x=pi/3: y=-2 | x=pi/2: y=-1.12
x=2pi/3: y=1 | x=5pi/6: y=3.12 | x=pi: y=4 | x=7pi/6: y=3.12
x=4pi/3: y=1 | x=3pi/2: y=-1.12 | x=5pi/3: y=-2 | x=11pi/6: y=-1.12 | x=2pi: y=1 [3m]
(b) Correct smooth curve through all points with correct scale. [3m]
(c)(i) From y + 3sin(3x/2) = 1 and 3sin(3x/2) = 4x/pi - 2:
Substitute: 1-y = 4x/pi - 2 -> y = 3 - 4x/pi.
Straight line: y = 3 - 4x/pi [1m]
(c)(ii) Draw y = 3 - 4x/pi (at x=0: y=3; at x=3pi/4: y=0; at x=3pi/2: y=-3).
Read intersections from graph. x = 3pi/4 (approx). [1m]`
    },
  ];

  console.log(`Seeding ${questions.length} questions — ADD_MATH 2023 P1...`);
  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    console.log(`  ${q.questionNo} done`);
  }
  console.log('\nDone. 15 questions seeded (A:12, B:3).');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });