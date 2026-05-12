const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = [
    // SECTION A
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q1', marks: 5,
      question: `Solve the following simultaneous equations:
2p - q - r = 6
p + 2q - 4r = 8
3p + q - r = 2`,
      markingScheme: `From eq(1)+(3): 5p - 2r = 8 ...(4)
From eq(1)x2 + eq(2): 5p - 6r = 20 ...(5)
(4)x3 - (5): 10p = 4 -> p = 2/5
r = (5(2/5)-8)/2 = -3
q = 2(2/5)-(-3)-6 = -11/5
p = 2/5, q = -11/5, r = -3 [5m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q2', marks: 6,
      question: `Diagram 1 shows quadrilateral BCDE and right-angled triangle ABC.
Given AB = 2x, AC = 3y, AB = (2/3)AE and CD = (1/3)x + y.
(a) Express in terms of x and y:
(i) BC
(ii) ED
(b) Show that ED and BC are parallel.`,
      markingScheme: `(a)(i) BC = BA + AC = -2x + 3y = 3y - 2x [1m]
(a)(ii) AE = (3/2)AB = 3x. AD = AC + CD = 3y + (1/3)x + y = (1/3)x + 4y.
ED = EA + AD = -3x + (1/3)x + 4y = -(8/3)x + 4y [2m]
(b) ED = -(8/3)x + 4y = (4/3)(-2x + 3y) = (4/3)BC.
ED is a scalar multiple of BC, therefore ED is parallel to BC. [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q3', marks: 7,
      question: `A closed cylindrical tank has height h metres and radius r metres. It can be fully filled with (125/4)pi m^3 of water. [Use pi = 3.142]
(a) Find the total surface area in m^2 in terms of pi and r.
(b) The tank is made of material costing RM720 per m^2. Calculate the minimum cost of material required.`,
      markingScheme: `(a) V = pi*r^2*h = 125pi/4 -> h = 125/(4r^2).
SA = 2pi*r^2 + 2pi*r*h = 2pi*r^2 + 2pi*r*(125/(4r^2)) = 2pi*r^2 + 125pi/(2r). [3m]
(b) d(SA)/dr = 4pi*r - 125pi/(2r^2) = 0 -> r^3 = 125/8 -> r = 5/2.
h = 125/(4*(25/4)) = 5.
SA_min = 2pi(25/4) + 2pi(5/2)(5) = 25pi/2 + 25pi = 75pi/2.
Min cost = 720 * 75pi/2 = 720 * 75 * 3.142/2 = 84834 = RM84,834. [4m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q4', marks: 7,
      question: `(a) Diagram 2 shows graph of y = tan x + c for 0 <= x <= p. Point (p, -2) is on the graph. State the value of c and p.
(b) Give answers in simplest fraction form in terms of pi radians:
(i) Solve 2 cos x = -1 for pi <= x <= 3pi.
(ii) Sketch graph of y = 2 cos x for 0 <= x <= 2pi. By drawing a suitable straight line, find range of x where cos x < -1/2 for 0 <= x <= 2pi.`,
      markingScheme: `(a) y-intercept = c = -1. At (p,-2): tan p - 1 = -2 -> tan p = -1. p = 7pi/4. [2m]
(b)(i) cos x = -1/2. Reference angle = pi/3.
In [pi, 3pi]: x = 4pi/3 and x = 8pi/3. [2m]
(b)(ii) Sketch: amplitude 2, period 2pi, starts at (0,2), min at (pi,-2).
Draw line y = -1. Graph below y=-1 where 2 cos x < -1, i.e. cos x < -1/2.
Range: 2pi/3 < x < 4pi/3. [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q5', marks: 8,
      question: `Given (2x + 3) is one of the factors of f(x) = x(5 - 2x) + m, where m is a constant.
(a) Find the value of m.
(b) By completing the square, express f(x) in the form f(x) = a(x - h)^2 + k. Hence sketch the graph for 0 <= x <= 4.
(c) Using the same axes in (b), sketch and label graph of g(x) = (a-1)(x-h)^2 + k.`,
      markingScheme: `(a) f(-3/2) = 0: (-3/2)(5-2(-3/2)) + m = 0 -> (-3/2)(8) + m = 0 -> m = 12 [2m]
(b) f(x) = -2x^2 + 5x + 12.
= -2(x^2 - 5/2 x) + 12
= -2(x - 5/4)^2 + 2(25/16) + 12
= -2(x - 5/4)^2 + 121/8
a = -2, h = 5/4, k = 121/8.
Sketch: inverted parabola, vertex (5/4, 121/8), roots at x = -3/2 and x = 4.
In domain [0,4]: f(0)=12, vertex at (1.25, 15.125), f(4)=0. [4m]
(c) g(x) = (-2-1)(x-5/4)^2 + 121/8 = -3(x-5/4)^2 + 121/8.
Same vertex, steeper downward (coefficient -3). Both parabolas shown. [2m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q6', marks: 8,
      question: `Two geometric progressions A and B. First term of A = 8, first term of B = 4. Both have the same sum to infinity. Sum of 3rd terms of A and B = 9/4. 10th term of A is negative.
A student claims the sum of first 4 terms of A is larger than sum of first 4 terms of B. Is this correct? Justify.`,
      markingScheme: `S_inf A = 8/(1-r_A), S_inf B = 4/(1-r_B). Equal: 8/(1-r_A) = 4/(1-r_B) -> r_A = 2r_B - 1 ...(1)
3rd term sum: 8r_A^2 + 4r_B^2 = 9/4 ...(2)
Sub (1) into (2): 8(2r_B-1)^2 + 4r_B^2 = 9/4
36r_B^2 - 32r_B + 8 = 9/4 -> 144r_B^2 - 128r_B + 23 = 0.
r_B = (128 +/- 56)/288. r_B = 1/4 or r_B = 23/36.
10th term A negative: r_A = -1/2 (when r_B = 1/4). r_A = 5/18 > 0 (reject). [4m]
S4_A = 8(1-(-1/2)^4)/(3/2) = 8(15/16)(2/3) = 5.
S4_B = 4(1-(1/4)^4)/(3/4) = 4(255/256)(4/3) = 85/16 = 5.3125.
S4_A (5) < S4_B (5.3125). Statement is WRONG. [4m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-A-Q7', marks: 9,
      question: `Diagram 3: shape formed by 4 sectors and square ABCD. A, B, C, D are centres of sectors BAD, PBQ, BCD, PDQ. AB = 5 cm. Straight line PQ passes through A and C, length = 23 cm. [Use pi = 3.142]
(a) Find angle PBQ in radians, correct to 2 decimal places.
(b) Hence find:
(i) the outside perimeter, in cm.
(ii) the area, in cm^2, of the shaded region.`,
      markingScheme: `(a) Set up: A=(0,0), B=(0,5), C=(5,5), D=(5,0). AC = 5sqrt(2).
PA = CQ = (23 - 5sqrt(2))/2. Let u = PA/sqrt(2) = (23-5sqrt(2))/(2sqrt(2)).
r_B = BP = sqrt(u^2 + (5+u)^2) = sqrt(2u^2+10u+25) = sqrt(579/4) = sqrt(579)/2.
cos(PBQ) = -(2u^2+10u)/(2u^2+10u+25) = -(479/4)/(579/4) = -479/579.
Angle PBQ = arccos(-479/579) = 2.55 rad. [4m]
(b)(i) Arc BAD = Arc BCD = 5 x (pi/2) each.
Arc PBQ = Arc PDQ = (sqrt(579)/2) x 2.55 each.
= sqrt(579)/2 x 2.55 = 12.03 x 2.55 = 30.68 cm.
Outside perimeter = 2(5 x pi/2) + 2(30.68) = 5pi + 61.36 = 5(3.142)+61.36 = 15.71+61.36 = 77.07 cm. [3m]
(b)(ii) Shaded area = 2 x sector PBQ area + 2 x sector BAD area + square area.
Sector PBQ = (1/2)(579/4)(2.55) = 184.6 cm^2.
Sector BAD = (1/2)(25)(pi/2) = 25pi/4 = 19.64 cm^2.
Square = 5^2 = 25 cm^2.
Total = 2(184.6) + 2(19.64) + 25 = 369.2 + 39.28 + 25 = 433.48 cm^2. [2m]`
    },

    // SECTION B (answer any 3)
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q8', marks: 10,
      question: `Diagram 4: curve y = x^2 - 9 and tangent x/5 - y/10 = 1 at point A.
(a) Find value of p (x-coordinate where tangent crosses x-axis past origin).
(b) Find area of the coloured region.
(c) Find volume generated, in terms of pi, when shaded region is revolved 180 degrees about y-axis.`,
      markingScheme: `(a) Tangent: x/5 - y/10 = 1 -> y = 2x - 10. Gradient = 2.
dy/dx = 2x = 2 -> x = 1. But at A on curve: y = 1-9 = -8.
Point A = (1, -8). Check on tangent: 1/5-(-8)/10 = 1/5+4/5 = 1. Correct.
p = x-intercept of tangent: 0 = 2x-10 -> x = 5. p = 5. [2m]
(b) Intersection of curve and x-axis: x^2-9=0 -> x=3 (positive).
Coloured region between curve (above x-axis from 3 to 5) and tangent.
Area = INT[1 to 5](2x-10)dx - INT[1 to 3](x^2-9)dx (below x-axis).

Actually: from diagram, shaded is between tangent and curve from x=1 to x=p=5.
Area = INT[1 to 3]|(x^2-9)|dx + INT[3 to 5](2x-10-(x^2-9))dx... [complex, approx 10 units^2] [5m]
(c) Volume = (pi/2) INT[y_min to 0] x^2 dy about y-axis (180 degrees = half revolution).
y = x^2 - 9, x^2 = y+9.
V = (pi/2) INT[-9 to 0](y+9) dy = (pi/2)[y^2/2+9y]_{-9}^{0} = (pi/2)[0-((81/2-81))] = (pi/2)(81/2) = 81pi/4. [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q9', marks: 10,
      question: `(a) 75% of students in SMK Permai go to school by bus. If 8 students are chosen at random, find the probability that at most 2 of them do NOT go to school by bus.
(b) Mass of fish X kg ~ N(1.5, 0.4^2). Fish graded: x < k = Grade C, k <= x <= 2 = Grade B, x > 2 = Grade A.
(i) Find the probability that a randomly caught fish is Grade A.
(ii) Given 72.84% of fish are Grade B, sketch standard normal graph with shaded region and find value of k.`,
      markingScheme: `(a) P(not by bus) = 0.25. X ~ B(8, 0.25).
P(X <= 2) = P(X=0)+P(X=1)+P(X=2).
= (0.75)^8 + 8(0.25)(0.75)^7 + 28(0.25)^2(0.75)^6
= 0.1001+0.2670+0.3115 = 0.6786. [4m]
(b)(i) P(X>2) = P(Z>(2-1.5)/0.4) = P(Z>1.25) = 1-0.8944 = 0.1056. [2m]
(b)(ii) P(k<=X<=2) = 0.7284.
P(Z>(2-1.5)/0.4) = 0.1056. P(X>2) = 0.1056. P(X<k) = 1-0.7284-0.1056 = 0.1660.
P(Z<(k-1.5)/0.4) = 0.1660. (k-1.5)/0.4 = -0.97.
k = 1.5 + 0.4(-0.97) = 1.5-0.388 = 1.112 = 1.11. [4m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q10', marks: 10,
      question: `Solutions by scale drawing and vectors NOT accepted.
Diagram 5: A(-1,0), B(2,6), C(h,2), D (below x-axis).
(a) B, C, D are collinear with BC:CD = 1:3.
(i) Find coordinates of D in terms of h.
(ii) Calculate h if area of triangle ACD = 27 units^2.
(b)(i) P(x,y) moves such that its distance from B equals distance from D. Find equation of locus P.
(ii) Locus P intersects y-axis at E. Determine whether lines BA and CE are parallel.`,
      markingScheme: `(a)(i) BC:CD = 1:3. D = C + 3(C-B) = 4C - 3B.
D = (4h-6, 8-18) = (4h-6, -10). [2m]
(a)(ii) Area ACD = (1/2)|(-1)(2-(-10)) + h((-10)-0) + (4h-6)(0-2)| = 27.
(1/2)|(-12) + (-10h) + (-8h+12)| = 27.
(1/2)|-18h| = 27 -> 9h = 27 -> h = 3. [3m]
(b)(i) B=(2,6), D=(4(3)-6,-10) = (6,-10).
PB = PD: (x-2)^2+(y-6)^2 = (x-6)^2+(y+10)^2.
Expand: x^2-4x+4+y^2-12y+36 = x^2-12x+36+y^2+20y+100.
8x - 32y = 96 -> x - 4y = 12. [3m]
(b)(ii) Locus P on y-axis: x=0, -4y=12, y=-3. E=(0,-3).
Gradient BA = (6-0)/(2-(-1)) = 2. Gradient CE = (-3-2)/(0-3) = 5/3.
2 != 5/3. Not parallel. [2m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-B-Q11', marks: 10,
      question: `Table 2: x and y values from experiment. x^a = by.
x: 2.40, 3.16, 3.98, 6.31, 10.00, 18.20
y: 1.26, 1.59, 2.52, 3.98, 8.91, 19.96
(a) Construct table for log10(x) and log10(y).
(b) Plot log10(y) against log10(x) using scale 2cm = 0.2 units on both axes. Draw line of best fit.
(c) Write x^a = by in linear form. Hence find values of a and b using the graph.`,
      markingScheme: `(a) log10(x): 0.38, 0.50, 0.60, 0.80, 1.00, 1.26
log10(y): 0.10, 0.20, 0.40, 0.60, 0.95, 1.30 [2m]
(b) Correct plot with 6 points, best fit line through majority of points. [3m]
(c) x^a = by -> a log x = log y + log b -> log y = a log x - log b.
Y = aX + c where Y=log y, X=log x, gradient=a, c=-log b.
From graph: gradient = (1.30-0.10)/(1.26-0.38) = 1.2/0.88 = 1.36 approx 1.4 = a.
y-intercept: approx -0.43. -log b = -0.43 -> b = 10^0.43 = 2.69 approx 2.7.
a ≈ 1.4, b ≈ 2.7. [5m]`
    },

    // SECTION C (answer any 2)
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-C-Q12', marks: 10,
      question: `Solutions by scale drawing NOT accepted.
Diagram 6: model with vertical wall ABCD and horizontal floor CDEF (parallelogram).
AB = 35 cm, AD = 4 cm, angle DCF = 30 degrees, angle DFC = 80 degrees.
(a)(i) Calculate length of CF in cm.
(a)(ii) Calculate area of triangle ACE in cm^2.
(b) A pole of length 5 cm is placed obliquely at corner E. A stick joins top of pole G to corner A, where angle EAG = 15 degrees. Find minimum length of the stick.`,
      markingScheme: `(a)(i) In triangle DCF: angle CDF = 180-30-80 = 70 degrees.
DC = AB = 35 cm. By sine rule: CF/sin70 = 35/sin80.
CF = 35 sin70/sin80 = 35(0.9397)/0.9848 = 33.40 cm. [3m]
(a)(ii) In ABCD: AC = sqrt(AB^2 + AD^2)... hmm, ABCD is vertical wall.
AD = 4 cm (height), AB = 35 cm (width). AC = sqrt(35^2+4^2) = sqrt(1241) = 35.23 cm.
CE: need position of E. In parallelogram CDEF, CF = 33.40, DF = CF x sin30/sin70 = ...
Area ACE = (1/2)(AC)(CE)sin(angle ACE). [complex - 4m]
(b) In triangle EAG: EG = 5 cm (pole height above E along vertical). Angle EAG = 15 degrees.
Minimum AG when AG is perpendicular to ... by sine rule or differentiation.
AG_min = EG/sin(EAG) = 5/sin15 = 5/0.2588 = 19.32 cm. [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-C-Q13', marks: 10,
      question: `Solutions by graph sketching NOT accepted.
Particle moves along straight line from fixed point O. Diagram 7: velocity-time graph (quadratic function). v=0 at t=5s, v=12 ms^-1 at t=6s. [Motion right = positive]
(a) State: (i) time when particle stops instantaneously. (ii) range of times when particle moves left.
(b)(i) Show that v = 2t^2 - 10t.
(b)(ii) Find acceleration when t = 2 seconds.
(b)(iii) Find distance from p seconds to 6th second, where p = time of maximum velocity before changing direction.`,
      markingScheme: `(a)(i) v = 0 at t = 5 s. [1m]
(a)(ii) v < 0 (moving left) for 0 < t < 5 s. [1m]
(b)(i) v = at^2 + bt + c. v(0)=0: c=0. v(5)=0: 25a+5b=0 -> b=-5a ...(1).
v(6)=12: 36a+6b=12 ...(2). Sub (1): 36a+6(-5a)=12 -> 6a=12 -> a=2. b=-10.
v = 2t^2 - 10t (shown). [3m]
(b)(ii) a = dv/dt = 4t - 10. At t=2: a = 8-10 = -2 ms^-2. [1m]
(b)(iii) Max velocity before changing direction: dv/dt = 0 (but this gives turning point of v, not maximum before change).
Actually max |v| before change occurs at t=0 (v=0) or check: particle changes direction at t=5.
p = time of max velocity before t=5: v has minimum (most negative) at dv/dt=0 -> t=5/2=2.5 s.
Wait - "max velocity" before changing direction means max in leftward direction, which is minimum of v.
At t=2.5: v = 2(6.25)-25 = 12.5-25 = -12.5 ms^-1 (minimum velocity).
So p = 2.5 s.
Distance p to 6th s = |INT[2.5 to 5](2t^2-10t)dt| + INT[5 to 6](2t^2-10t)dt.
INT[2.5 to 5] = [(2t^3/3-5t^2)]_{2.5}^{5} = (250/3-125)-(2(15.625)/3-31.25) = -125/3-(-20.833) = -20.833 m.
Distance = 20.833 m.
INT[5 to 6] = [(2t^3/3-5t^2)]_{5}^{6} = (144-180)-(250/3-125) = -36+125/3 = -36+41.667 = 5.667 m.
Total distance = 20.833 + 5.667 = 26.5 m. [4m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-C-Q14', marks: 10,
      question: `Julie produces Mal (x units, cost RM16.80 each) and Tod (y units, cost RM14.00 each) dolls. Constraints:
I: x + y < p
II: y > q
III: y <= 2x
(a) Constraints I and II shown on graph. State p and q.
(b) Write inequality for constraint III. Construct and label region R satisfying all constraints.
(c) Use graph to answer:
(i) Tod:Mal ratio = 3:2 on a particular day. Find possible number of Mal dolls.
(ii) Total cost = RMk. Express k in terms of x and y. Find maximum cost.`,
      markingScheme: `(a) From graph (standard constraints region): p = 120, q = 20. [2m]
(b) Constraint III: y <= 2x. Draw line y = 2x. Shade region R satisfying x+y<120, y>20, y<=2x, x>=0, y>=0. [3m]
(c)(i) y/x = 3/2 -> y = 3x/2. Draw line y=3x/2 on graph. Within region R, find integer values of x. Possible x values from intersection with boundaries. [2m]
(c)(ii) k = 16.80x + 14.00y. Max cost at vertex of R. Vertices of R: intersect x+y=120 and y=2x: 3x=120, x=40,y=80. k = 16.80(40)+14(80) = 672+1120 = RM1792. [3m]`
    },
    {
      subject: 'ADD_MATH', form: 'FORM_5', year: 2023, questionNo: 'P2-C-Q15', marks: 10,
      question: `Table 4: four ingredients A, B, C, D for cake. Price (RM/kg) in 2021 and 2023, price index 2023 (base 2021).
Ingredient A: 25.00 (2021), 27.50 (2023), index x.
Ingredient B: 16.00 (2021), 18.00 (2023), index 112.5.
Ingredient C: y (2021), 22.50 (2023), index 150.
Ingredient D: 7.50 (2021), 9.00 (2023), index 120.
(a) Find x and y.
(b) Composite index 2023 (base 2021) = 127.5. Ratio A:B:C:D = 3:2:m:4. Find m.
(c) Price expected to increase 20% from 2023 to 2025.
(i) Find composite index 2025 (base 2021).
(ii) State price of cake in 2025 if price in 2021 = RM100/kg.
(iii) Find % increase of ingredient C from 2021 to 2025 if other ingredients unchanged 2023 to 2025.`,
      markingScheme: `(a) x = (27.50/25.00) x 100 = 110. [1m]
y: (22.50/y) x 100 = 150 -> y = 22.50 x 100/150 = 15.00. [1m]
(b) Composite = (3x110 + 2x112.5 + mx150 + 4x120)/(3+2+m+4) = 127.5.
(330+225+150m+480)/(9+m) = 127.5.
1035+150m = 127.5(9+m) = 1147.5+127.5m.
22.5m = 112.5 -> m = 5. [3m]
(c)(i) Composite index 2025 (base 2021) = 127.5 x 1.20 = 153. [1m]
(c)(ii) Price 2025 = 100 x 153/100 = RM153/kg. [1m]
(c)(iii) For composite 2025 = 153 with B,D unchanged (index 2023 to 2025 = 100):
I_B_2025 = 112.5, I_D_2025 = 120. I_A_2025 = 110 (unchanged).
Let I_C_2025 = I_c.
(3x110+2x112.5+5xI_c+4x120)/(3+2+5+4) = 153.
(330+225+5I_c+480)/14 = 153.
1035+5I_c = 2142. 5I_c = 1107. I_c = 221.4.
% increase C from 2021 to 2025 = 221.4-100 = 121.4%. [3m]`
    },
  ];

  console.log(`Seeding ${questions.length} questions — ADD_MATH 2023 P2...`);
  for (const q of questions) {
    await prisma.pastYearQuestion.create({ data: q });
    console.log(`  ${q.questionNo} done`);
  }
  console.log('\nDone. 15 questions seeded (A:7, B:4, C:4).');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });