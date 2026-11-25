import type { XRayVarId } from "@/store/useCourseStore";
import type { RiemannMethod } from "@/lib/mathEngine";

export type VariableTone = "amber" | "cyan" | "teal" | "violet" | "rose";

export interface XRayVariableMeta {
  id: XRayVarId;
  symbol: string;
  label: string;
  description: string;
  graphHint: string;
  tone: VariableTone;
}

export const XRAY_VARIABLES: Record<XRayVarId, XRayVariableMeta> = {
  "var-a": {
    id: "var-a",
    symbol: "a",
    label: "Нижня межа інтегрування",
    description:
      "Ліва стінка відрізка [a, b] на осі X, з якої починається накопичення площі.",
    graphHint: "Підсвічує вертикальну межу x = a та точку на осі абсцис.",
    tone: "amber",
  },
  "var-b": {
    id: "var-b",
    symbol: "b",
    label: "Верхня межа інтегрування",
    description:
      "Права стінка відрізка [a, b]. Якщо поміняти a і b місцями, знак інтеграла зміниться на протилежний.",
    graphHint: "Підсвічує вертикальну межу x = b та праву точку кривої.",
    tone: "cyan",
  },
  "var-fx": {
    id: "var-fx",
    symbol: "f(x)",
    label: "Підінтегральна функція",
    description:
      "Задає висоту криволінійної трапеції у кожній точці x. Значення нижче осі X дають від'ємний внесок.",
    graphHint: "Підсвічує криву y = f(x) на графіку.",
    tone: "teal",
  },
  "var-dx": {
    id: "var-dx",
    symbol: "dx / Δxᵢ",
    label: "Ширина елементарного відрізка",
    description:
      "Нескінченно мала ширина смужки (у сумі Рімана Δxᵢ = xᵢ − xᵢ₋₁ — основа i-го прямокутника).",
    graphHint: "Підсвічує ширину бази прямокутників розбиття на осі X.",
    tone: "cyan",
  },
  "var-xi": {
    id: "var-xi",
    symbol: "ξᵢ",
    label: "Вибрана точка на відрізку",
    description:
      "Довільна точка ξᵢ ∈ [xᵢ₋₁, xᵢ], у якій береться висота прямокутника f(ξᵢ) (ліва, середня або права).",
    graphHint: "Підсвічує опорні точки (ξᵢ, f(ξᵢ)) на графіку суми Рімана.",
    tone: "amber",
  },
  "var-tau": {
    id: "var-tau",
    symbol: "|τ| → 0",
    label: "Діаметр розбиття τ",
    description:
      "Максимальна довжина серед усіх відрізків розбиття: |τ| = max Δxᵢ. Коли |τ| → 0, східчаста фігура зливається з кривою.",
    graphHint: "Показує подрібнення прямокутників при збільшенні n.",
    tone: "violet",
  },
  "var-sigma": {
    id: "var-sigma",
    symbol: "σ_f(ξ̄)",
    label: "Інтегральна сума (сума Рімана)",
    description:
      "Сума площ усіх n прямокутників східчастої фігури. У границі при |τ| → 0 дає точний інтеграл.",
    graphHint: "Підсвічує сукупність прямокутників під кривою.",
    tone: "teal",
  },
  "var-F": {
    id: "var-F",
    symbol: "F(x)",
    label: "Первісна функції f(x)",
    description:
      "Функція, похідна якої дорівнює f(x). Константа +C взаємно знищується у різниці F(b) − F(a).",
    graphHint: "Підсвічує криву первісної F(x) та приріст F(b) − F(a).",
    tone: "violet",
  },
  "var-c": {
    id: "var-c",
    symbol: "c",
    label: "Точка розбиття відрізка",
    description:
      "Проміжна точка a < c < b, яка ділить загальну площу на дві незалежні частини (адитивність).",
    graphHint: "Підсвічує точку розрізу x = c між лівою та правою областями.",
    tone: "amber",
  },
  "var-k": {
    id: "var-k",
    symbol: "k",
    label: "Сталий множник",
    description:
      "Константу k ∈ ℝ можна виносити за знак інтеграла: масштабування графіка по осі Y у k разів масштабує площу в k разів.",
    graphHint: "Підсвічує масштабовану криву k·f(x).",
    tone: "rose",
  },
  "var-mu": {
    id: "var-mu",
    symbol: "μ",
    label: "Середнє значення функції",
    description:
      "Число μ ∈ [m, M] — висота рівновеликого прямокутника μ(b − a), площа якого точно дорівнює інтегралу.",
    graphHint: "Підсвічує горизонтальну лінію y = μ та рівновеликий прямокутник.",
    tone: "amber",
  },
  "var-phi": {
    id: "var-phi",
    symbol: "φ(t)",
    label: "Функція заміни змінної",
    description:
      "Диференційовна підстановка x = φ(t), що відображає [α, β] у [a, b] і спрощує підінтегральний вираз.",
    graphHint: "Підсвічує підінтегральну криву та зв'язок нової змінної t.",
    tone: "violet",
  },
  "var-alpha": {
    id: "var-alpha",
    symbol: "α",
    label: "Нова нижня межа",
    description:
      "Значення нової змінної t, для якого φ(α) = a. Після перерахунку меж повертатися до x не потрібно.",
    graphHint: "Відповідає лівій межі x = a після підстановки.",
    tone: "amber",
  },
  "var-beta": {
    id: "var-beta",
    symbol: "β",
    label: "Нова верхня межа",
    description:
      "Значення нової змінної t, для якого φ(β) = b. Критичний крок, про який найчастіше забувають!",
    graphHint: "Відповідає правій межі x = b після підстановки.",
    tone: "cyan",
  },
  "var-u": {
    id: "var-u",
    symbol: "u(x)",
    label: "Множник для диференціювання",
    description:
      "Частина підінтегрального виразу, яка спрощується при взятті похідної (за правилом LIATE: ln x, arctg x, многочлен P(x)).",
    graphHint: "Підсвічує внесок граничного члена u(x)v(x)|ₐᵇ.",
    tone: "amber",
  },
  "var-dv": {
    id: "var-dv",
    symbol: "v'(x)dx",
    label: "Диференціал dv для інтегрування",
    description:
      "Частина виразу, первісну v(x) від якої легко знайти за таблицею (eˣ dx, cos x dx, sin x dx).",
    graphHint: "Підсвічує підінтегральну криву добутку u·v'.",
    tone: "cyan",
  },
  "var-v": {
    id: "var-v",
    symbol: "v(x)",
    label: "Первісна від dv",
    description:
      "Отримується інтегруванням dv; входить у позаінтегральний доданок u(x)v(x)|ₐᵇ та в новий інтеграл ∫v·u'dx.",
    graphHint: "Підсвічує підсумкову площу інтеграла.",
    tone: "teal",
  },
  "var-du": {
    id: "var-du",
    symbol: "u'(x)dx",
    label: "Диференціал du",
    description:
      "Похідна від u(x), помножена на dx. Має зробити залишковий інтеграл ∫v·du простішим за вихідний.",
    graphHint: "Підсвічує криву залишкового інтеграла v(x)u'(x).",
    tone: "rose",
  },
  "var-sym": {
    id: "var-sym",
    symbol: "−a … a",
    label: "Симетричні межі інтегрування",
    description:
      "Відрізок [−a, a], симетричний відносно початку координат O(0, 0). Обов'язкова умова теореми про парність/непарність.",
    graphHint: "Підсвічує дзеркальні половини [−a, 0] та [0, a] на графіку.",
    tone: "teal",
  },
};

export interface SandboxFunctionOption {
  id: string;
  label: string;
  latexLabel: string;
  expr: string;
  antiderivativeExpr?: string;
  antiderivativeLatex?: string;
  residualExpr?: string;
  boundaryTermExpr?: string;
  parity?: "even" | "odd" | "neither";
  domainMin?: number;
  domainMax?: number;
  defaultA: number;
  defaultB: number;
  yRange: [number, number];
  xRange: [number, number];
}

export interface EdgeCasePreset {
  id: string;
  label: string;
  description: string;
  functionId?: string;
  a: number;
  b: number;
  n?: number;
  method?: RiemannMethod;
  c?: number;
  k?: number;
  constC?: number;
  subMode?: "additivity" | "mean-value";
  symmetricLock?: boolean;
}

export type SandboxMode =
  | "riemann"
  | "properties"
  | "newton-leibniz"
  | "substitution"
  | "by-parts"
  | "symmetry";

export interface SandboxConfig {
  mode: SandboxMode;
  title: string;
  subtitle: string;
  functions: SandboxFunctionOption[];
  defaultFunctionId: string;
  defaultN: number;
  defaultMethod: RiemannMethod;
  defaultC?: number;
  defaultK?: number;
  presets: EdgeCasePreset[];
}

export interface ProofStep {
  id: string;
  tag: string;
  explanation: string;
  latex: string;
  note?: string;
}

export interface WorkedExample {
  id: string;
  title: string;
  sourceRef: string;
  problemLatex: string;
  steps: ProofStep[];
  finalAnswerLatex: string;
}

export interface CheatSheetItem {
  id: string;
  title: string;
  formulaLatex: string;
  hint: string;
}

export interface QuizOption {
  id: string;
  letter: "A" | "B" | "C" | "D";
  labelLatex?: string;
  labelText?: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  promptText: string;
  promptLatex?: string;
  options: QuizOption[];
}

export interface ModuleDefinitionBlock {
  badge: string;
  title: string;
  lead: string;
  formulaLatex: string;
  secondaryFormulaLatex?: string;
  lectureNote?: string;
}

export interface ModuleTheoremBlock {
  badge: string;
  title: string;
  statement: string;
  formulaLatex: string;
  bullets?: { id: string; latex: string; label: string }[];
  lectureNote?: string;
}

export interface CourseModule {
  id: string;
  number: number;
  shortTitle: string;
  sectionLabel: string;
  title: string;
  durationMinutes: number;
  hook: string;
  definition: ModuleDefinitionBlock;
  sandbox: SandboxConfig;
  theorem: ModuleTheoremBlock;
  examples: WorkedExample[];
  cheatSheet: CheatSheetItem[];
  stickyNote: string;
  quiz: QuizQuestion[];
}

export const COURSE_META = {
  brand: "Вишмат",
  courseTitle: "Лекція № 11 · § 14",
  lecturer: "доц. Андрусяк І. В. (с. 73–76)",
  subtitle: "Визначений інтеграл та методи обчислення",
};

export const COURSE_MODULES: CourseModule[] = [
  /* -------------------------------------------------------------------------- */
  /* MODULE 1: PARTITION & RIEMANN INTEGRAL                                     */
  /* -------------------------------------------------------------------------- */
  {
    id: "riemann-integral",
    number: 1,
    shortTitle: "Розбиття та інтеграл",
    sectionLabel: "Модуль 1 · § 14.1–14.2",
    title: "Визначений інтеграл",
    durationMinutes: 12,
    hook: "У фізиці й комп'ютерній графіці інтеграл — це сума нескінченно тонких смужок (пройдений шлях при змінній швидкості або площа криволінійної фігури). Ми нарізаємо відрізок [a, b] на n прямокутників і спрямовуємо найбільшу ширину |τ| до нуля.",
    definition: {
      badge: "Означення",
      title: "Інтегральна сума та інтеграл Рімана",
      lead: "Для розбиття τ = {xᵢ} (i = 0…n) відрізка [a, b] з вибраними точками ξᵢ ∈ [xᵢ₋₁, xᵢ] та діаметром |τ| = max Δxᵢ визначаємо:",
      formulaLatex:
        "\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,\\htmlClass{var-dx}{dx} = \\lim_{\\htmlClass{var-tau}{|\\tau|\\to 0}} \\htmlClass{var-sigma}{\\sum_{i=1}^{n} f(\\htmlClass{var-xi}{\\xi_i})\\cdot \\htmlClass{var-dx}{\\Delta x_i}}",
      secondaryFormulaLatex:
        "\\htmlClass{var-sigma}{\\sigma_f(\\bar{\\xi})} = \\sum_{i=1}^{n} \\htmlClass{var-fx}{f(\\htmlClass{var-xi}{\\xi_i})}\\,\\htmlClass{var-dx}{\\Delta x_i}, \\qquad \\htmlClass{var-tau}{|\\tau|} = \\max_{1\\le i\\le n} \\htmlClass{var-dx}{\\Delta x_i}",
      lectureNote:
        "Примітка з конспекту: відрізки розбиття [xᵢ₋₁, xᵢ] нумеруються для i = 1, 2, …, n (при i = 0 відрізка [x₋₁, x₀] не існує).",
    },
    sandbox: {
      mode: "riemann",
      title: "Графік та інтеграл",
      subtitle:
        "Змінюй число розбиттів n, спосіб вибору точок ξᵢ та межі [a, b] — порівнюй східчасту суму σ_f(ξ̄) із точним інтегралом.",
      defaultFunctionId: "x2",
      defaultN: 12,
      defaultMethod: "mid",
      functions: [
        {
          id: "x2",
          label: "y = x²",
          latexLabel: "y = x^2",
          expr: "x^2",
          defaultA: 0,
          defaultB: 2,
          xRange: [-1, 3.2],
          yRange: [-1.2, 5.2],
        },
        {
          id: "sinx",
          label: "y = sin(x)",
          latexLabel: "y = \\sin x",
          expr: "sin(x)",
          defaultA: 0,
          defaultB: 3.14,
          xRange: [-0.8, 6.6],
          yRange: [-1.6, 1.8],
        },
        {
          id: "cubic",
          label: "y = x³ − x",
          latexLabel: "y = x^3 - x",
          expr: "x^3 - x",
          defaultA: -1,
          defaultB: 1.5,
          xRange: [-1.8, 2.2],
          yRange: [-2.2, 3.2],
        },
        {
          id: "cosx",
          label: "y = cos(x)",
          latexLabel: "y = \\cos x",
          expr: "cos(x)",
          defaultA: 0,
          defaultB: 2.4,
          xRange: [-1.5, 4.5],
          yRange: [-1.6, 1.8],
        },
      ],
      presets: [
        {
          id: "classic-x2",
          label: "База: x² на [0, 2]",
          description: "Класична парабола: 12 середніх прямокутників дають 2.662 проти точного 8/3 ≈ 2.667.",
          functionId: "x2",
          a: 0,
          b: 2,
          n: 12,
          method: "mid",
        },
        {
          id: "negative-area",
          label: "А що як f(x) < 0?",
          description: "На [0, 2π] sin(x) має рівні додатну й від'ємну хвилі: алгебраїчний інтеграл = 0, а геометрична площа = 4!",
          functionId: "sinx",
          a: 0,
          b: 6.28,
          n: 16,
          method: "mid",
        },
        {
          id: "reversed-bounds",
          label: "Перевернути a > b",
          description: "Якщо нижня межа більша за верхню (a = 2, b = 0), кроки Δxᵢ < 0 і весь інтеграл змінює знак на −8/3.",
          functionId: "x2",
          a: 2,
          b: 0,
          n: 12,
          method: "mid",
        },
        {
          id: "fine-partition",
          label: "|τ| → 0 (n = 48)",
          description: "При n = 48 діаметр розбиття |τ| = 0.042, і східчаста сума практично збігається з точним інтегралом.",
          functionId: "x2",
          a: 0,
          b: 2,
          n: 48,
          method: "mid",
        },
      ],
    },
    theorem: {
      badge: "Геометричний зміст",
      title: "Алгебраїчна площа vs Геометрична площа",
      statement:
        "Коли f(x) ≥ 0 на [a, b], інтегральна сума дорівнює площі східчастої фігури AA₁B₁B₂…AₙBₙB, а границя — площі криволінійної трапеції. Якщо графік опускається нижче осі X, інтеграл рахує площу зі знаком «−».",
      formulaLatex:
        "S_{\\text{алгебр.}} = \\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,\\htmlClass{var-dx}{dx}, \\qquad S_{\\text{геом.}} = \\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} |\\htmlClass{var-fx}{f(x)}|\\,\\htmlClass{var-dx}{dx}",
    },
    examples: [
      {
        id: "ex-riemann-x2",
        title: "Приклад побудови суми Рімана",
        sourceRef: "§ 14.1–14.2 · Геометричний зміст",
        problemLatex: "\\int_{0}^{2} x^2\\,dx \\text{ через границю } \\lim_{|\\tau|\\to 0}\\sigma_f(\\bar{\\xi})",
        finalAnswerLatex: "\\frac{8}{3} \\approx 2.667",
        steps: [
          {
            id: "r-step-1",
            tag: "Крок 1 · Розбиття τ",
            explanation:
              "Ділимо відрізок [0, 2] на n рівних відрізків [xᵢ₋₁, xᵢ] довжиною Δxᵢ = 2/n.",
            latex:
              "\\htmlClass{step-changed}{\\Delta x_i = \\frac{2 - 0}{n} = \\frac{2}{n}}, \\quad x_i = \\frac{2i}{n}, \\quad i = 1, 2, \\ldots, n",
          },
          {
            id: "r-step-2",
            tag: "Крок 2 · Вибір точок ξᵢ",
            explanation:
              "Оберемо праві кінці кожного відрізка: ξᵢ = xᵢ = 2i/n, і обчислимо висоти f(ξᵢ).",
            latex:
              "\\xi_i = \\frac{2i}{n} \\implies \\htmlClass{step-changed}{f(\\xi_i) = \\left(\\frac{2i}{n}\\right)^2 = \\frac{4i^2}{n^2}}",
          },
          {
            id: "r-step-3",
            tag: "Крок 3 · Інтегральна сума σ_f",
            explanation:
              "Складаємо площі всіх n прямокутників та виносимо множники, що не залежать від i.",
            latex:
              "\\sigma_f(\\bar{\\xi}) = \\sum_{i=1}^{n} \\frac{4i^2}{n^2}\\cdot\\frac{2}{n} = \\htmlClass{step-changed}{\\frac{8}{n^3}\\sum_{i=1}^{n} i^2}",
          },
          {
            id: "r-step-4",
            tag: "Крок 4 · Сума квадратів і границя",
            explanation:
              "Підставляємо формулу суми квадратів і переходимо до границі при |τ| = 2/n → 0 (n → ∞).",
            latex:
              "\\lim_{n\\to\\infty} \\frac{8}{n^3}\\cdot\\frac{n(n+1)(2n+1)}{6} = \\lim_{n\\to\\infty} \\frac{8}{6}\\left(1+\\frac{1}{n}\\right)\\left(2+\\frac{1}{n}\\right) = \\htmlClass{step-changed}{\\frac{8}{3}}",
          },
        ],
      },
    ],
    cheatSheet: [
      {
        id: "cs-1-1",
        title: "Діаметр розбиття",
        formulaLatex: "|\\tau| = \\max_{1\\le i\\le n} (x_i - x_{i-1})",
        hint: "Найбільший крок серед усіх підвідрізків",
      },
      {
        id: "cs-1-2",
        title: "Сума Рімана",
        formulaLatex: "\\sigma_f(\\bar{\\xi}) = \\sum_{i=1}^{n} f(\\xi_i)\\Delta x_i",
        hint: "Сума площ n прямокутників",
      },
      {
        id: "cs-1-3",
        title: "Інтеграл константи",
        formulaLatex: "\\int_a^b k\\,dx = k(b - a)",
        hint: "Площа одного прямокутника",
      },
      {
        id: "cs-1-4",
        title: "Перестановка меж",
        formulaLatex: "\\int_b^a f(x)\\,dx = -\\int_a^b f(x)\\,dx",
        hint: "Зміна напрямку обходу міняє знак",
      },
    ],
    stickyNote: "|τ| → 0 — це стискання НАЙШИРШОГО прямокутника, а не просто n → ∞!",
    quiz: [
      {
        id: "q-1-1",
        promptText: "Що означає умова |τ| → 0 в означенні визначеного інтеграла Рімана?",
        options: [
          {
            id: "q-1-1-a",
            letter: "A",
            labelText: "Довжина всього відрізка [a, b] прямує до нуля",
            isCorrect: false,
            feedback: "Відрізок [a, b] фіксований — стискаються лише окремі шматочки розбиття Δxᵢ.",
          },
          {
            id: "q-1-1-b",
            letter: "B",
            labelText: "Максимальна з довжин Δxᵢ прямує до нуля",
            isCorrect: true,
            feedback: "Точно! Якщо найбільший крок max Δxᵢ → 0, то автоматично всі кроки прямують до 0 і n → ∞.",
          },
          {
            id: "q-1-1-c",
            letter: "C",
            labelText: "Значення функції f(ξᵢ) прямують до нуля",
            isCorrect: false,
            feedback: "Ні, |τ| залежить лише від точок розбиття на осі X, а не від значень f(x).",
          },
          {
            id: "q-1-1-d",
            letter: "D",
            labelText: "Кількість точок розбиття дорівнює нулю",
            isCorrect: false,
            feedback: "Навпаки, щоб найбільший крок прямував до нуля, кількість точок n має необмежено зростати.",
          },
        ],
      },
      {
        id: "q-1-2",
        promptText: "Чому дорівнює визначений інтеграл на повному періоді синуса?",
        promptLatex: "\\int_{0}^{2\\pi} \\sin x\\,dx = ?",
        options: [
          {
            id: "q-1-2-a",
            letter: "A",
            labelLatex: "4",
            isCorrect: false,
            feedback: "4 — це геометрична площа ∫|sin x|dx. У визначеному інтегралі від'ємна хвиля на [π, 2π] входить зі знаком «−».",
          },
          {
            id: "q-1-2-b",
            letter: "B",
            labelLatex: "2",
            isCorrect: false,
            feedback: "2 — це площа лише першої хвилі на [0, π]. Друга хвиля на [π, 2π] дає −2.",
          },
          {
            id: "q-1-2-c",
            letter: "C",
            labelLatex: "0",
            isCorrect: true,
            feedback: "Вірно! Додатна хвиля (+2) та від'ємна хвиля (−2) взаємно компенсуються.",
          },
          {
            id: "q-1-2-d",
            letter: "D",
            labelLatex: "-2",
            isCorrect: false,
            feedback: "Хвилі мають однакову площу за модулем: (+2) + (−2) = 0.",
          },
        ],
      },
      {
        id: "q-1-3",
        promptText: "У розбитті τ = {x₀, x₁, …, xₙ} відрізки [xᵢ₋₁, xᵢ] мають індекси:",
        options: [
          {
            id: "q-1-3-a",
            letter: "A",
            labelLatex: "i = 0, 1, \\ldots, n",
            isCorrect: false,
            feedback: "Це відома друкарська помилка з конспекту! При i = 0 не існує точки x₋₁.",
          },
          {
            id: "q-1-3-b",
            letter: "B",
            labelLatex: "i = 1, 2, \\ldots, n",
            isCorrect: true,
            feedback: "Правильно! Точок розбиття n + 1 (від x₀ до xₙ), а відрізків між ними рівно n (від [x₀, x₁] до [xₙ₋₁, xₙ]).",
          },
          {
            id: "q-1-3-c",
            letter: "C",
            labelLatex: "i = 1, 2, \\ldots, n - 1",
            isCorrect: false,
            feedback: "Тоді ми б загубили останній відрізок [xₙ₋₁, xₙ].",
          },
          {
            id: "q-1-3-d",
            letter: "D",
            labelLatex: "i = 0, 1, \\ldots, n - 1",
            isCorrect: false,
            feedback: "Для запису [xᵢ₋₁, xᵢ] індекс i = 0 некоректний (дає x₋₁).",
          },
        ],
      },
      {
        id: "q-1-4",
        promptText: "Яка властивість виконується, якщо a = b?",
        promptLatex: "\\int_{a}^{a} f(x)\\,dx = ?",
        options: [
          {
            id: "q-1-4-a",
            letter: "A",
            labelLatex: "f(a)",
            isCorrect: false,
            feedback: "Точка на осі X має нульову ширину Δx = 0, тому площа відрізка нульова.",
          },
          {
            id: "q-1-4-b",
            letter: "B",
            labelLatex: "0",
            isCorrect: true,
            feedback: "Так! Відрізок вироджується в точку, ширина бази дорівнює 0.",
          },
          {
            id: "q-1-4-c",
            letter: "C",
            labelLatex: "1",
            isCorrect: false,
            feedback: "Площа смужки нульової ширини завжди дорівнює 0.",
          },
          {
            id: "q-1-4-d",
            letter: "D",
            labelText: "Не існує",
            isCorrect: false,
            feedback: "Інтеграл існує і за означенням дорівнює 0.",
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* MODULE 2: PROPERTIES & MEAN VALUE THEOREM                                  */
  /* -------------------------------------------------------------------------- */
  {
    id: "properties-mean-value",
    number: 2,
    shortTitle: "Властивості й середнє",
    sectionLabel: "Модуль 2 · § 14.3–14.4",
    title: "Властивості та теорема про середнє",
    durationMinutes: 10,
    hook: "Лінійність і адитивність дозволяють розрізати складну фігуру на прості фрагменти, а теорема про середнє показує, якою висотою μ треба вирівняти «хвилю» графіка, щоб отримати прямокутник тієї ж площі.",
    definition: {
      badge: "Властивості 1–4",
      title: "Чотири базові властивості інтеграла",
      lead: "Якщо функції f, g інтегровні на [a, b], k ∈ ℝ та a < c < b, то інтеграл лінійний, монотонний і адитивний за відрізком:",
      formulaLatex:
        "\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,\\htmlClass{var-dx}{dx} = \\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-c}{c}} \\htmlClass{var-fx}{f(x)}\\,dx + \\int_{\\htmlClass{var-c}{c}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,dx",
      secondaryFormulaLatex:
        "\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-k}{k}\\,\\htmlClass{var-fx}{f(x)}\\,dx = \\htmlClass{var-k}{k}\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,dx",
    },
    sandbox: {
      mode: "properties",
      title: "Пісочниця адитивності та середньої висоти μ",
      subtitle:
        "Перемикайся між розрізом відрізка точкою c (адитивність + множник k) та візуалізацією прямокутника середнього значення μ(b − a).",
      defaultFunctionId: "parabola-shift",
      defaultN: 16,
      defaultMethod: "mid",
      defaultC: 1.4,
      defaultK: 1,
      functions: [
        {
          id: "parabola-shift",
          label: "y = 0.5x² + 0.6",
          latexLabel: "f(x) = 0.5x^2 + 0.6",
          expr: "0.5 * x^2 + 0.6",
          defaultA: 0,
          defaultB: 2.6,
          xRange: [-0.8, 3.6],
          yRange: [-1.5, 4.8],
        },
        {
          id: "wave-pos",
          label: "y = 1.6 + sin(x)",
          latexLabel: "f(x) = 1.6 + \\sin x",
          expr: "1.6 + sin(x)",
          defaultA: 0,
          defaultB: 3.14,
          xRange: [-0.8, 4.2],
          yRange: [-1.5, 3.6],
        },
        {
          id: "const-fn",
          label: "y = 2 (константа)",
          latexLabel: "f(x) = 2",
          expr: "2",
          defaultA: 0,
          defaultB: 3,
          xRange: [-0.8, 4.0],
          yRange: [-1.5, 4.0],
        },
      ],
      presets: [
        {
          id: "mean-value-demo",
          label: "Теорема про середнє μ",
          description: "Жовтий прямокутник висотою μ має точно таку ж площу, що й криволінійна трапеція під f(x), причому m ≤ μ ≤ M.",
          functionId: "wave-pos",
          a: 0,
          b: 3.14,
          k: 1,
          subMode: "mean-value",
        },
        {
          id: "split-additivity",
          label: "Розріз точкою c = 1.4",
          description: "Сума бірюзової площі на [a, c] та фіолетової на [c, b] завжди дорівнює повному інтегралу на [a, b].",
          functionId: "parabola-shift",
          a: 0,
          b: 2.6,
          c: 1.4,
          k: 1,
          subMode: "additivity",
        },
        {
          id: "negative-scale",
          label: "Що як k = −1?",
          description: "Винесення множника k = −1 дзеркально перевертає графік відносно осі X і змінює знак площі.",
          functionId: "parabola-shift",
          a: 0,
          b: 2.4,
          c: 1.2,
          k: -1,
          subMode: "additivity",
        },
        {
          id: "flat-constant",
          label: "Константа: m = μ = M",
          description: "Для сталої функції f(x) = 2 мінімум, максимум і середнє значення збігаються: m = μ = M = 2.",
          functionId: "const-fn",
          a: 0,
          b: 3,
          k: 1,
          subMode: "mean-value",
        },
      ],
    },
    theorem: {
      badge: "Теорема 1",
      title: "Теорема про середнє значення",
      statement:
        "Нехай f інтегровна на відрізку [a, b] і для всіх x ∈ [a, b] виконується m ≤ f(x) ≤ M. Тоді існує число μ ∈ [m, M] таке, що:",
      formulaLatex:
        "\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,\\htmlClass{var-dx}{dx} = \\htmlClass{var-mu}{\\mu}(\\htmlClass{var-b}{b} - \\htmlClass{var-a}{a})",
      bullets: [
        {
          id: "prop-1",
          label: "1. Сума/різниця",
          latex: "\\int_a^b (f \\pm g)\\,dx = \\int_a^b f\\,dx \\pm \\int_a^b g\\,dx",
        },
        {
          id: "prop-2",
          label: "2. Константа",
          latex: "\\int_a^b k f(x)\\,dx = k \\int_a^b f(x)\\,dx",
        },
        {
          id: "prop-3",
          label: "3. Монотонність",
          latex: "f(x) \\le g(x) \\implies \\int_a^b f(x)\\,dx \\le \\int_a^b g(x)\\,dx",
        },
        {
          id: "prop-4",
          label: "4. Адитивність",
          latex: "\\int_a^b f\\,dx = \\int_a^c f\\,dx + \\int_c^b f\\,dx",
        },
      ],
    },
    examples: [
      {
        id: "ex-prop-estimate",
        title: "Оцінка інтеграла за Теоремою 1 та лінійністю",
        sourceRef: "§ 14.3–14.4 · Застосування властивостей",
        problemLatex: "\\text{Оцінити та знайти } \\mu \\text{ для } I = \\int_{0}^{2} (x^2 + 1)\\,dx",
        finalAnswerLatex: "2 \\le I \\le 10, \\quad I = \\frac{14}{3}, \\quad \\mu = \\frac{7}{3}",
        steps: [
          {
            id: "p-step-1",
            tag: "Крок 1 · Межі m та M",
            explanation:
              "На відрізку [0, 2] функція f(x) = x² + 1 зростає, тому мінімум досягається в x = 0, а максимум — у x = 2.",
            latex:
              "\\htmlClass{step-changed}{m = f(0) = 1}, \\qquad \\htmlClass{step-changed}{M = f(2) = 5}",
          },
          {
            id: "p-step-2",
            tag: "Крок 2 · Оцінка через монотонність",
            explanation:
              "За властивістю 3 (монотонність) інтегруємо нерівність 1 ≤ x² + 1 ≤ 5 на [0, 2]:",
            latex:
              "1\\cdot(2 - 0) \\le \\int_{0}^{2}(x^2+1)\\,dx \\le 5\\cdot(2 - 0) \\implies \\htmlClass{step-changed}{2 \\le I \\le 10}",
          },
          {
            id: "p-step-3",
            tag: "Крок 3 · Лінійність (властивість 1)",
            explanation:
              "Розбиваємо інтеграл суми на суму двох табличних інтегралів:",
            latex:
              "I = \\htmlClass{step-changed}{\\int_0^2 x^2\\,dx + \\int_0^2 1\\,dx} = \\frac{8}{3} + 2 = \\frac{14}{3}",
          },
          {
            id: "p-step-4",
            tag: "Крок 4 · Середнє значення μ",
            explanation:
              "Ділимо точний інтеграл на довжину відрізка (b − a) = 2 і переконуємося, що μ ∈ [1, 5]:",
            latex:
              "\\htmlClass{step-changed}{\\mu = \\frac{I}{b - a} = \\frac{14/3}{2} = \\frac{7}{3} \\approx 2.333 \\in [1, 5]}",
          },
        ],
      },
    ],
    cheatSheet: [
      {
        id: "cs-2-1",
        title: "Лінійність",
        formulaLatex: "\\int_a^b (k_1 f + k_2 g)\\,dx = k_1\\int_a^b f + k_2\\int_a^b g",
        hint: "Сталий множник і сума вільно розділяються",
      },
      {
        id: "cs-2-2",
        title: "Адитивність",
        formulaLatex: "\\int_a^b f\\,dx = \\int_a^c f\\,dx + \\int_c^b f\\,dx",
        hint: "Можна розрізати проміжок у точці c",
      },
      {
        id: "cs-2-3",
        title: "Оцінка інтеграла",
        formulaLatex: "m(b-a) \\le \\int_a^b f(x)\\,dx \\le M(b-a)",
        hint: "Випливає з монотонності та m ≤ f(x) ≤ M",
      },
      {
        id: "cs-2-4",
        title: "Середнє значення",
        formulaLatex: "\\mu = \\frac{1}{b-a}\\int_a^b f(x)\\,dx",
        hint: "Середня висота функції на [a, b]",
      },
    ],
    stickyNote: "Середнє μ завжди лежить між m і M: m ≤ μ ≤ M!",
    quiz: [
      {
        id: "q-2-1",
        promptText: "Відомо, що ∫₀³ f(x)dx = 5 та ∫₃⁷ f(x)dx = −2. Чому дорівнює ∫₀⁷ f(x)dx?",
        options: [
          {
            id: "q-2-1-a",
            letter: "A",
            labelLatex: "7",
            isCorrect: false,
            feedback: "Інтеграли додаються з урахуванням знаків: 5 + (−2), а не 5 + 2.",
          },
          {
            id: "q-2-1-b",
            letter: "B",
            labelLatex: "3",
            isCorrect: true,
            feedback: "Правильно! За властивістю адитивності ∫₀⁷ = ∫₀³ + ∫₃⁷ = 5 + (−2) = 3.",
          },
          {
            id: "q-2-1-c",
            letter: "C",
            labelLatex: "-10",
            isCorrect: false,
            feedback: "Площі на суміжних відрізках додаються, а не перемножуються.",
          },
          {
            id: "q-2-1-d",
            letter: "D",
            labelLatex: "2.5",
            isCorrect: false,
            feedback: "Адитивність — це звичайна сума двох частинних інтегралів.",
          },
        ],
      },
      {
        id: "q-2-2",
        promptText: "На [1, 4] функція задовольняє 2 ≤ f(x) ≤ 6. У яких межах гарантовано лежить ∫₁⁴ f(x)dx?",
        options: [
          {
            id: "q-2-2-a",
            letter: "A",
            labelLatex: "[2,\\; 6]",
            isCorrect: false,
            feedback: "Ви забули помножити на довжину відрізка (b − a) = 4 − 1 = 3!",
          },
          {
            id: "q-2-2-b",
            letter: "B",
            labelLatex: "[6,\\; 18]",
            isCorrect: true,
            feedback: "Точно! m(b − a) = 2·3 = 6, M(b − a) = 6·3 = 18.",
          },
          {
            id: "q-2-2-c",
            letter: "C",
            labelLatex: "[8,\\; 24]",
            isCorrect: false,
            feedback: "Довжина відрізка [1, 4] дорівнює 4 − 1 = 3, а не 4.",
          },
          {
            id: "q-2-2-d",
            letter: "D",
            labelLatex: "[0,\\; 12]",
            isCorrect: false,
            feedback: "Оскільки f(x) ≥ 2 на всьому відрізку довжиною 3, інтеграл не менший за 6.",
          },
        ],
      },
      {
        id: "q-2-3",
        promptText: "Якщо ∫₀² f(x)dx = 4, то чому дорівнює ∫₀² (3f(x) − 1)dx?",
        options: [
          {
            id: "q-2-3-a",
            letter: "A",
            labelLatex: "11",
            isCorrect: false,
            feedback: "Увага: ∫₀² 1 dx = 2, а не 1! Тому 3·4 − 2 = 10.",
          },
          {
            id: "q-2-3-b",
            letter: "B",
            labelLatex: "10",
            isCorrect: true,
            feedback: "Вірно! За лінійністю: 3·∫₀² f(x)dx − ∫₀² 1 dx = 3·4 − 1·(2 − 0) = 10.",
          },
          {
            id: "q-2-3-c",
            letter: "C",
            labelLatex: "12",
            isCorrect: false,
            feedback: "Не загубіть інтеграл від «−1» на відрізку [0, 2].",
          },
          {
            id: "q-2-3-d",
            letter: "D",
            labelLatex: "6",
            isCorrect: false,
            feedback: "Перевірте: 3·4 = 12, мінус площа прямокутника 1×2 дає 10.",
          },
        ],
      },
      {
        id: "q-2-4",
        promptText: "Чому дорівнює середнє значення μ функції f(x) = x² на відрізку [0, 3]?",
        options: [
          {
            id: "q-2-4-a",
            letter: "A",
            labelLatex: "9",
            isCorrect: false,
            feedback: "9 — це значення інтеграла ∫₀³ x²dx, а не середня висота μ = I / (3 − 0).",
          },
          {
            id: "q-2-4-b",
            letter: "B",
            labelLatex: "4.5",
            isCorrect: false,
            feedback: "4.5 — це середнє арифметичне кінців (0 + 9)/2, але парабола ввігнута вниз, тому μ менше.",
          },
          {
            id: "q-2-4-c",
            letter: "C",
            labelLatex: "3",
            isCorrect: true,
            feedback: "Точно! ∫₀³ x²dx = 9, ділимо на довжину (3 − 0) = 3 і отримуємо μ = 3.",
          },
          {
            id: "q-2-4-d",
            letter: "D",
            labelLatex: "1.5",
            isCorrect: false,
            feedback: "Перевірте: I = 3³/3 = 9, μ = 9 / 3 = 3.",
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* MODULE 3: NEWTON-LEIBNIZ FORMULA                                           */
  /* -------------------------------------------------------------------------- */
  {
    id: "newton-leibniz",
    number: 3,
    shortTitle: "Ньютон–Лейбніц",
    sectionLabel: "Модуль 3 · Теорема 2",
    title: "Формула Ньютона–Лейбніца",
    durationMinutes: 12,
    hook: "Рахувати границю сум Рімана щоразу — пекельна праця. Основна теорема аналізу зводить усе до двох кроків: знайти будь-яку первісну F(x) і зробити одне віднімання F(b) − F(a).",
    definition: {
      badge: "Теорема 2",
      title: "Основна теорема інтегрального числення",
      lead: "Нехай f неперервна на відрізку [a, b], а F — її первісна на цьому відрізку (F'(x) = f(x)). Тоді:",
      formulaLatex:
        "\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,\\htmlClass{var-dx}{dx} = \\left.\\htmlClass{var-F}{F(x)}\\right|_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} = \\htmlClass{var-F}{F}(\\htmlClass{var-b}{b}) - \\htmlClass{var-F}{F}(\\htmlClass{var-a}{a})",
      secondaryFormulaLatex:
        "(\\htmlClass{var-F}{F}(\\htmlClass{var-b}{b}) + C) - (\\htmlClass{var-F}{F}(\\htmlClass{var-a}{a}) + C) = \\htmlClass{var-F}{F}(\\htmlClass{var-b}{b}) - \\htmlClass{var-F}{F}(\\htmlClass{var-a}{a})",
    },
    sandbox: {
      mode: "newton-leibniz",
      title: "Площа під f(x) = Приріст первісної F(b) − F(a)",
      subtitle:
        "Покрути повзунок константи +C: фіолетова крива первісної F(x)+C зсувається вертикально, але різниця F(b) − F(a) залишається незмінною!",
      defaultFunctionId: "cos-ex1",
      defaultN: 16,
      defaultMethod: "mid",
      functions: [
        {
          id: "cos-ex1",
          label: "cos(x) (Приклад 1.1)",
          latexLabel: "f(x) = \\cos x",
          expr: "cos(x)",
          antiderivativeExpr: "sin(x)",
          antiderivativeLatex: "F(x) = \\sin x",
          defaultA: 0,
          defaultB: 0.7854,
          xRange: [-0.8, 3.6],
          yRange: [-2.2, 3.2],
        },
        {
          id: "atan-ex1",
          label: "1/(16+x²) (Приклад 1.2)",
          latexLabel: "f(x) = \\frac{1}{16 + x^2}",
          expr: "1 / (16 + x^2)",
          antiderivativeExpr: "0.25 * atan(x / 4)",
          antiderivativeLatex: "F(x) = \\frac{1}{4}\\operatorname{arctg}\\frac{x}{4}",
          defaultA: 0,
          defaultB: 4,
          xRange: [-0.8, 5.2],
          yRange: [-0.6, 1.8],
        },
        {
          id: "linear-2x",
          label: "2x (Класика)",
          latexLabel: "f(x) = 2x",
          expr: "2 * x",
          antiderivativeExpr: "x^2",
          antiderivativeLatex: "F(x) = x^2",
          defaultA: 0,
          defaultB: 1,
          xRange: [-0.8, 2.6],
          yRange: [-1.5, 4.5],
        },
      ],
      presets: [
        {
          id: "nl-ex1-1",
          label: "Приклад 1.1: [0, π/4]",
          description: "∫₀^(π/4) cos x dx = sin(π/4) − sin(0) = √2/2 ≈ 0.707.",
          functionId: "cos-ex1",
          a: 0,
          b: 0.7854,
          constC: 0,
        },
        {
          id: "nl-ex1-2",
          label: "Приклад 1.2: [0, 4]",
          description: "∫₀⁴ dx/(16 + x²) = ¼(arctg 1 − arctg 0) = π/16 ≈ 0.1963.",
          functionId: "atan-ex1",
          a: 0,
          b: 4,
          constC: 0,
        },
        {
          id: "nl-shift-c",
          label: "Зсунути +C = +1.5",
          description: "Первісна піднялася на +1.5, але приріст (F(b)+1.5) − (F(a)+1.5) залишився точно таким же!",
          functionId: "cos-ex1",
          a: 0,
          b: 0.7854,
          constC: 1.5,
        },
        {
          id: "nl-swap",
          label: "Поміняти a ↔ b",
          description: "Заміна [0, 1] на [1, 0] перетворює F(1) − F(0) = +1 на F(0) − F(1) = −1.",
          functionId: "linear-2x",
          a: 1,
          b: 0,
          constC: 0,
        },
      ],
    },
    theorem: {
      badge: "Формула Ньютона–Лейбніца",
      title: "Чому константа +C зникає?",
      statement:
        "У невизначеному інтегралі ми завжди пишемо +C, бо похідна від сталої дорівнює нулю. У визначеному інтегралі ми обчислюємо різницю значень на кінцях відрізка, тому будь-яке C скорочується.",
      formulaLatex:
        "\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,\\htmlClass{var-dx}{dx} = \\htmlClass{var-F}{F}(\\htmlClass{var-b}{b}) - \\htmlClass{var-F}{F}(\\htmlClass{var-a}{a})",
    },
    examples: [
      {
        id: "ex-1-1",
        title: "Приклад 1.1 (з лекції)",
        sourceRef: "Лекція 11 · Приклад 1 (п. 1)",
        problemLatex: "\\int_{0}^{\\pi/4} \\cos x\\,dx",
        finalAnswerLatex: "\\frac{\\sqrt{2}}{2}",
        steps: [
          {
            id: "nl1-step-1",
            tag: "Крок 1 · Знайти первісну F(x)",
            explanation:
              "Таблична первісна для f(x) = cos x — це F(x) = sin x (бо (sin x)' = cos x).",
            latex:
              "\\int_{0}^{\\pi/4} \\cos x\\,dx = \\htmlClass{step-changed}{\\left.\\sin x\\right|_{0}^{\\pi/4}}",
          },
          {
            id: "nl1-step-2",
            tag: "Крок 2 · Підставити верхню й нижню межі",
            explanation:
              "Спочатку підставляємо верхню межу b = π/4, потім віднімаємо значення у нижній межі a = 0.",
            latex:
              "\\left.\\sin x\\right|_{0}^{\\pi/4} = \\htmlClass{step-changed}{\\sin\\frac{\\pi}{4} - \\sin 0}",
          },
          {
            id: "nl1-step-3",
            tag: "Крок 3 · Обчислити результат",
            explanation: "Підставляємо табличні значення sin(π/4) = √2/2 та sin(0) = 0.",
            latex:
              "\\sin\\frac{\\pi}{4} - \\sin 0 = \\frac{\\sqrt{2}}{2} - 0 = \\htmlClass{step-changed}{\\frac{\\sqrt{2}}{2}}",
          },
        ],
      },
      {
        id: "ex-1-2",
        title: "Приклад 1.2 (з лекції)",
        sourceRef: "Лекція 11 · Приклад 1 (п. 2)",
        problemLatex: "\\int_{0}^{4} \\frac{dx}{16 + x^2}",
        finalAnswerLatex: "\\frac{\\pi}{16}",
        steps: [
          {
            id: "nl2-step-1",
            tag: "Крок 1 · Упізнати табличну формулу",
            explanation:
              "Записуємо 16 як 4² і застосовуємо табличний інтеграл ∫dx/(a² + x²) = (1/a)·arctg(x/a) при a = 4.",
            latex:
              "\\int_{0}^{4} \\frac{dx}{4^2 + x^2} = \\htmlClass{step-changed}{\\left.\\frac{1}{4}\\operatorname{arctg}\\frac{x}{4}\\right|_{0}^{4}}",
          },
          {
            id: "nl2-step-2",
            tag: "Крок 2 · Винести 1/4 і підставити межі",
            explanation:
              "Підставляємо x = 4 та x = 0 у вираз arctg(x/4), залишаючи 1/4 за дужками.",
            latex:
              "\\frac{1}{4}\\left(\\htmlClass{step-changed}{\\operatorname{arctg}\\frac{4}{4} - \\operatorname{arctg}\\frac{0}{4}}\\right) = \\frac{1}{4}\\left(\\operatorname{arctg} 1 - \\operatorname{arctg} 0\\right)",
          },
          {
            id: "nl2-step-3",
            tag: "Крок 3 · Спростити до точної відповіді",
            explanation:
              "Знаємо, що arctg(1) = π/4, а arctg(0) = 0. Множимо на 1/4.",
            latex:
              "\\frac{1}{4}\\left(\\frac{\\pi}{4} - 0\\right) = \\htmlClass{step-changed}{\\frac{\\pi}{16}}",
          },
        ],
      },
    ],
    cheatSheet: [
      {
        id: "cs-3-1",
        title: "Константа",
        formulaLatex: "\\int_a^b k\\,dx = k(b - a)",
        hint: "Первісна kx на межах [a, b]",
      },
      {
        id: "cs-3-2",
        title: "Степенева",
        formulaLatex: "\\int_a^b x^n\\,dx = \\frac{b^{n+1} - a^{n+1}}{n+1}",
        hint: "Для n ≠ −1",
      },
      {
        id: "cs-3-3",
        title: "Логарифмічна",
        formulaLatex: "\\int \\frac{dx}{x} = \\ln|x| + C",
        hint: "Для відрізків, що не містять 0",
      },
      {
        id: "cs-3-4",
        title: "Арктангенс (Приклад 1.2)",
        formulaLatex: "\\int \\frac{dx}{a^2 + x^2} = \\frac{1}{a}\\operatorname{arctg}\\frac{x}{a} + C",
        hint: "Не загуби множник 1/a попереду!",
      },
    ],
    stickyNote: "F(b) − F(a), не навпаки!",
    quiz: [
      {
        id: "q-3-1",
        promptText: "Обчисліть визначений інтеграл за формулою Ньютона–Лейбніца:",
        promptLatex: "\\int_{0}^{1} 2x\\,dx = ?",
        options: [
          {
            id: "q-3-1-a",
            letter: "A",
            labelLatex: "0",
            isCorrect: false,
            feedback: "На [0, 1] функція 2x ≥ 0 і утворює трикутник з основою 1 та висотою 2 — площа точно більша за 0.",
          },
          {
            id: "q-3-1-b",
            letter: "B",
            labelLatex: "1",
            isCorrect: true,
            feedback: "Молодець! Первісна F(x) = x², тому F(1) − F(0) = 1² − 0² = 1.",
          },
          {
            id: "q-3-1-c",
            letter: "C",
            labelLatex: "2",
            isCorrect: false,
            feedback: "2 — це значення підінтегральної функції у точці 1, а первісна від 2x дорівнює x², а не 2x.",
          },
          {
            id: "q-3-1-d",
            letter: "D",
            labelLatex: "\\frac{1}{2}",
            isCorrect: false,
            feedback: "1/2 — це ∫₀¹ x dx, але в умові стоїть множник 2 перед x.",
          },
        ],
      },
      {
        id: "q-3-2",
        promptText: "Обчисліть за зразком Прикладу 1.2:",
        promptLatex: "\\int_{0}^{3} \\frac{dx}{9 + x^2} = ?",
        options: [
          {
            id: "q-3-2-a",
            letter: "A",
            labelLatex: "\\frac{\\pi}{4}",
            isCorrect: false,
            feedback: "Загублено коефіцієнт 1/a = 1/3 перед арктангенсом!",
          },
          {
            id: "q-3-2-b",
            letter: "B",
            labelLatex: "\\frac{\\pi}{12}",
            isCorrect: true,
            feedback: "Точно! (1/3)·(arctg(3/3) − arctg(0)) = (1/3)·(π/4) = π/12.",
          },
          {
            id: "q-3-2-c",
            letter: "C",
            labelLatex: "\\frac{\\pi}{36}",
            isCorrect: false,
            feedback: "Перед arctg(x/a) стоїть 1/a = 1/3, а не 1/a² = 1/9.",
          },
          {
            id: "q-3-2-d",
            letter: "D",
            labelLatex: "\\frac{\\pi}{6}",
            isCorrect: false,
            feedback: "arctg(1) = π/4, помноживши на 1/3, маємо π/12.",
          },
        ],
      },
      {
        id: "q-3-3",
        promptText: "Яку помилку допущено в обчисленні ∫₁² 3x² dx = 1³ − 2³ = −7?",
        options: [
          {
            id: "q-3-3-a",
            letter: "A",
            labelText: "Неправильно знайдено первісну від 3x²",
            isCorrect: false,
            feedback: "(x³)' = 3x², тож первісна x³ знайдена цілком правильно.",
          },
          {
            id: "q-3-3-b",
            letter: "B",
            labelText: "Переплутано порядок підстановки: обчислено F(a) − F(b) замість F(b) − F(a)",
            isCorrect: true,
            feedback: "Влучний постріл! Має бути F(2) − F(1) = 8 − 1 = +7.",
          },
          {
            id: "q-3-3-c",
            letter: "C",
            labelText: "Забули додати константу +C",
            isCorrect: false,
            feedback: "У визначеному інтегралі константа +C скорочується.",
          },
          {
            id: "q-3-3-d",
            letter: "D",
            labelText: "Помилки немає",
            isCorrect: false,
            feedback: "Функція 3x² > 0 на [1, 2], тому інтеграл не може бути від'ємним!",
          },
        ],
      },
      {
        id: "q-3-4",
        promptText: "Обчисліть визначений інтеграл:",
        promptLatex: "\\int_{0}^{\\pi/2} \\cos x\\,dx = ?",
        options: [
          {
            id: "q-3-4-a",
            letter: "A",
            labelLatex: "0",
            isCorrect: false,
            feedback: "Первісна sin x у точці π/2 дорівнює 1, а в точці 0 — нулю.",
          },
          {
            id: "q-3-4-b",
            letter: "B",
            labelLatex: "-1",
            isCorrect: false,
            feedback: "Не плутайте з похідною: (sin x)' = +cos x, тому F(x) = +sin x.",
          },
          {
            id: "q-3-4-c",
            letter: "C",
            labelLatex: "1",
            isCorrect: true,
            feedback: "Правильно! sin(π/2) − sin(0) = 1 − 0 = 1.",
          },
          {
            id: "q-3-4-d",
            letter: "D",
            labelLatex: "\\frac{\\pi}{2}",
            isCorrect: false,
            feedback: "Перевірте: sin(π/2) = 1, а не π/2.",
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* MODULE 4: SUBSTITUTION                                                     */
  /* -------------------------------------------------------------------------- */
  {
    id: "substitution",
    number: 4,
    shortTitle: "Заміна змінних",
    sectionLabel: "Модуль 4 · Теорема 3",
    title: "Заміна змінних у визначеному інтегралі",
    durationMinutes: 14,
    hook: "Коли під інтегралом стоїть складна функція, ми стискаємо її в нову змінну t через підстановку x = φ(t). Головний бонус визначеного інтеграла: перерахуй межі [a, b] → [α, β] одразу — і повертатися до x у фіналі взагалі не потрібно!",
    definition: {
      badge: "Теорема 3",
      title: "Формула заміни змінних (2)",
      lead: "Нехай f неперервна на [a, b], φ диференційовна на [α, β], φ(α) = a і φ(β) = b. Тоді:",
      formulaLatex:
        "\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-fx}{f(x)}\\,\\htmlClass{var-dx}{dx} = \\int_{\\htmlClass{var-alpha}{\\alpha}}^{\\htmlClass{var-beta}{\\beta}} \\htmlClass{var-fx}{f}(\\htmlClass{var-phi}{\\varphi(t)})\\,\\htmlClass{var-phi}{\\varphi'(t)}\\,\\htmlClass{var-dx}{dt}",
      lectureNote:
        "Примітка з конспекту: важливо, щоб φ відображала [α, β] у [a, b], інакше вираз f(φ(t)) може виявитися невизначеним на частині [α, β].",
    },
    sandbox: {
      mode: "substitution",
      title: "Геометрія підстановок із Прикладу 2",
      subtitle:
        "Подивись наживо, чому ∫₀^√π x·cos(x²)dx дає рівно 0 (додатна і від'ємна пелюстки однакові!), а ∫₀¹ √(1 − x²)dx дорівнює площі чверті одиничного кола π/4.",
      defaultFunctionId: "x-cos-x2",
      defaultN: 20,
      defaultMethod: "mid",
      functions: [
        {
          id: "x-cos-x2",
          label: "x·cos(x²) (Приклад 2.1)",
          latexLabel: "f(x) = x\\cos(x^2)",
          expr: "x * cos(x^2)",
          defaultA: 0,
          defaultB: Math.sqrt(Math.PI),
          xRange: [-0.4, 2.5],
          yRange: [-2.1, 1.8],
        },
        {
          id: "quarter-circle",
          label: "√(1 − x²) (Приклад 2.2)",
          latexLabel: "f(x) = \\sqrt{1 - x^2}",
          expr: "sqrt(max(0, 1 - x^2))",
          domainMin: -1,
          domainMax: 1,
          defaultA: 0,
          defaultB: 1,
          xRange: [-1.3, 1.5],
          yRange: [-0.35, 1.45],
        },
      ],
      presets: [
        {
          id: "sub-ex2-1",
          label: "Приклад 2.1: [0, √π] → 0",
          description: "При b = √π ≈ 1.7725 нова межа y = x² досягає π, і площа над віссю X точно зрівнюється з площею під віссю X!",
          functionId: "x-cos-x2",
          a: 0,
          b: Math.sqrt(Math.PI),
          n: 24,
        },
        {
          id: "sub-ex2-1-peak",
          label: "Тільки перша хвиля [0, √(π/2)]",
          description: "Зупиняємось у точці b = √(π/2) ≈ 1.2533 (y = π/2): тут sin(π/2) = 1, тому інтеграл досягає максимуму ½ = 0.5.",
          functionId: "x-cos-x2",
          a: 0,
          b: Math.sqrt(Math.PI / 2),
          n: 20,
        },
        {
          id: "sub-ex2-2",
          label: "Приклад 2.2: чверть кола [0, 1]",
          description: "Підстановка x = sin t переводить [0, 1] у кут t ∈ [0, π/2]. Площа чверті одиничного круга = π/4 ≈ 0.7854.",
          functionId: "quarter-circle",
          a: 0,
          b: 1,
          n: 20,
        },
        {
          id: "sub-semicircle",
          label: "Повне півколо [−1, 1]",
          description: "Кут t пробігає [−π/2, π/2], а площа півкола дорівнює π/2 ≈ 1.5708.",
          functionId: "quarter-circle",
          a: -1,
          b: 1,
          n: 24,
        },
      ],
    },
    theorem: {
      badge: "Золоте правило",
      title: "Чекліст заміни у визначеному інтегралі",
      statement:
        "Змінювати треба одразу три елементи: підінтегральну функцію f(x), диференціал dx і межі інтегрування [a, b] → [α, β].",
      formulaLatex:
        "x = \\htmlClass{var-phi}{\\varphi(t)} \\implies \\htmlClass{var-dx}{dx} = \\htmlClass{var-phi}{\\varphi'(t)}\\,dt, \\quad \\htmlClass{var-a}{a} \\mapsto \\htmlClass{var-alpha}{\\alpha}, \\quad \\htmlClass{var-b}{b} \\mapsto \\htmlClass{var-beta}{\\beta}",
    },
    examples: [
      {
        id: "ex-2-1",
        title: "Приклад 2.1 (з лекції)",
        sourceRef: "Лекція 11 · Приклад 2 (п. 1)",
        problemLatex: "\\int_{0}^{\\sqrt{\\pi}} x\\cos(x^2)\\,dx",
        finalAnswerLatex: "0",
        steps: [
          {
            id: "s1-step-1",
            tag: "Крок 1 · Внести x під диференціал",
            explanation:
              "Помічаємо, що d(x²) = 2x dx, тому x dx = ½ d(x²). Виносимо ½ за інтеграл.",
            latex:
              "\\int_{0}^{\\sqrt{\\pi}} x\\cos(x^2)\\,dx = \\htmlClass{step-changed}{\\frac{1}{2}\\int_{0}^{\\sqrt{\\pi}} \\cos(x^2)\\,d(x^2)}",
          },
          {
            id: "s1-step-2",
            tag: "Крок 2 · Заміна y = x² та нові межі",
            explanation:
              "Вводимо y = x². Перераховуємо межі: x = 0 ⇒ y = 0² = 0; x = √π ⇒ y = (√π)² = π.",
            latex:
              "\\frac{1}{2}\\int_{\\htmlClass{step-changed}{0}}^{\\htmlClass{step-changed}{\\pi}} \\cos y\\,dy",
            note: "Примітка з конспекту: в оригіналі лекції тут була друкарська помилка «x cos y» із зайвим множником x — після заміни y = x² залишається лише cos y dy.",
          },
          {
            id: "s1-step-3",
            tag: "Крок 3 · Формула Ньютона–Лейбніца для y",
            explanation:
              "Беремо первісну sin y і підставляємо нові межі 0 та π (до x не повертаємось!).",
            latex:
              "\\left.\\frac{1}{2}\\sin y\\right|_{0}^{\\pi} = \\frac{1}{2}(\\sin\\pi - \\sin 0) = \\htmlClass{step-changed}{0}",
          },
        ],
      },
      {
        id: "ex-2-2",
        title: "Приклад 2.2 (з лекції)",
        sourceRef: "Лекція 11 · Приклад 2 (п. 2)",
        problemLatex: "\\int_{0}^{1} \\sqrt{1 - x^2}\\,dx",
        finalAnswerLatex: "\\frac{\\pi}{4}",
        steps: [
          {
            id: "s2-step-1",
            tag: "Крок 1 · Тригонометрична підстановка",
            explanation:
              "Покладаємо x = sin t, тоді dx = cos t dt. Межі: x = 0 ⇒ t = 0; x = 1 ⇒ t = π/2.",
            latex:
              "\\int_{\\htmlClass{step-changed}{0}}^{\\htmlClass{step-changed}{\\pi/2}} \\sqrt{1 - \\sin^2 t}\\,\\htmlClass{step-changed}{\\cos t\\,dt}",
            note: "Примітка з конспекту: на відрізку [0, π/2] виконується cos t ≥ 0, тому √(1 − sin² t) = |cos t| = cos t.",
          },
          {
            id: "s2-step-2",
            tag: "Крок 2 · Спростити корінь",
            explanation:
              "Оскільки cos t ≥ 0 на [0, π/2], отримуємо інтеграл від cos² t.",
            latex:
              "\\int_{0}^{\\pi/2} \\cos t \\cdot \\cos t\\,dt = \\htmlClass{step-changed}{\\int_{0}^{\\pi/2} \\cos^2 t\\,dt}",
          },
          {
            id: "s2-step-3",
            tag: "Крок 3 · Формула пониження степеня",
            explanation:
              "Замінюємо cos² t = ½(1 + cos 2t), щоб позбутися квадрата.",
            latex:
              "\\htmlClass{step-changed}{\\frac{1}{2}\\int_{0}^{\\pi/2} (1 + \\cos 2t)\\,dt}",
          },
          {
            id: "s2-step-4",
            tag: "Крок 4 · Первісна та межі [0, π/2]",
            explanation:
              "Інтегруємо 1 та cos 2t, підставляємо π/2 та 0 (sin π = 0, sin 0 = 0).",
            latex:
              "\\frac{1}{2}\\left.\\left(t + \\frac{\\sin 2t}{2}\\right)\\right|_{0}^{\\pi/2} = \\frac{1}{2}\\left(\\frac{\\pi}{2} + 0 - 0\\right) = \\htmlClass{step-changed}{\\frac{\\pi}{4}}",
          },
        ],
      },
    ],
    cheatSheet: [
      {
        id: "cs-4-1",
        title: "Заміна змінних",
        formulaLatex: "\\begin{aligned} &\\int_a^b f(x)\\,dx = \\\\ &\\int_\\alpha^\\beta f(\\varphi(t))\\varphi'(t)\\,dt \\end{aligned}",
        hint: "φ(α) = a, φ(β) = b",
      },
      {
        id: "cs-4-2",
        title: "Пониження степеня",
        formulaLatex: "\\cos^2 t = \\frac{1 + \\cos 2t}{2}",
        hint: "Використано у Прикладі 2.2",
      },
      {
        id: "cs-4-3",
        title: "Корінь √(a² − x²)",
        formulaLatex: "\\begin{aligned} x &= a\\sin t \\\\ dx &= a\\cos t\\,dt \\end{aligned}",
        hint: "Зводить корінь до a·cos t",
      },
      {
        id: "cs-4-4",
        title: "Диференціал x²",
        formulaLatex: "x\\,dx = \\frac{1}{2}d(x^2)",
        hint: "Використано у Прикладі 2.1",
      },
    ],
    stickyNote: "Змінив x на t — одразу перерахуй межі a → α, b → β!",
    quiz: [
      {
        id: "q-4-1",
        promptText: "У інтегралі ∫₁³ 2x·e^(x²) dx робимо заміну t = x². Якими стануть нові межі інтегрування?",
        options: [
          {
            id: "q-4-1-a",
            letter: "A",
            labelLatex: "\\text{від } 1 \\text{ до } 3",
            isCorrect: false,
            feedback: "Це старі межі для x! Їх обов'язково треба підставити в t = x².",
          },
          {
            id: "q-4-1-b",
            letter: "B",
            labelLatex: "\\text{від } 1 \\text{ до } 9",
            isCorrect: true,
            feedback: "Точно! При x = 1: t = 1² = 1; при x = 3: t = 3² = 9.",
          },
          {
            id: "q-4-1-c",
            letter: "C",
            labelLatex: "\\text{від } 0 \\text{ до } 9",
            isCorrect: false,
            feedback: "Нижня межа x = 1 дає t = 1² = 1, а не 0.",
          },
          {
            id: "q-4-1-d",
            letter: "D",
            labelLatex: "\\text{від } 1 \\text{ до } \\sqrt{3}",
            isCorrect: false,
            feedback: "Ви взяли корінь замість піднесення до квадрата: t = x².",
          },
        ],
      },
      {
        id: "q-4-2",
        promptText: "Чому у Прикладі 2.2 на відрізку t ∈ [0, π/2] ми записали √(1 − sin² t) = cos t без модуля?",
        options: [
          {
            id: "q-4-2-a",
            letter: "A",
            labelText: "Бо корінь з квадрата завжди дорівнює самому виразу без модуля",
            isCorrect: false,
            feedback: "Небезпечна пастка! У загальному випадку √(u²) = |u|.",
          },
          {
            id: "q-4-2-b",
            letter: "B",
            labelText: "Бо на відрізку [0, π/2] функція cos t ≥ 0",
            isCorrect: true,
            feedback: "Правильно! У першій чверті cos t невід'ємний, тому |cos t| = cos t.",
          },
          {
            id: "q-4-2-c",
            letter: "C",
            labelText: "Бо sin t = 0 на всьому відрізку",
            isCorrect: false,
            feedback: "На [0, π/2] синус зростає від 0 до 1.",
          },
          {
            id: "q-4-2-d",
            letter: "D",
            labelText: "Бо інтеграл не залежить від знака підінтегральної функції",
            isCorrect: false,
            feedback: "Знак безпосередньо змінює результат інтеграла!",
          },
        ],
      },
      {
        id: "q-4-3",
        promptText: "Обчисліть інтеграл (модифікація Прикладу 2.1):",
        promptLatex: "\\int_{0}^{\\sqrt{\\pi/2}} x\\cos(x^2)\\,dx = ?",
        options: [
          {
            id: "q-4-3-a",
            letter: "A",
            labelLatex: "0",
            isCorrect: false,
            feedback: "Нуль виходить на [0, √π], а тут верхня межа y = π/2, де sin(π/2) = 1.",
          },
          {
            id: "q-4-3-b",
            letter: "B",
            labelLatex: "1",
            isCorrect: false,
            feedback: "Ви забули множник 1/2 від x dx = ½ d(x²)!",
          },
          {
            id: "q-4-3-c",
            letter: "C",
            labelLatex: "\\frac{1}{2}",
            isCorrect: true,
            feedback: "Бездоганно! ½·(sin(π/2) − sin 0) = ½.",
          },
          {
            id: "q-4-3-d",
            letter: "D",
            labelLatex: "\\frac{\\pi}{4}",
            isCorrect: false,
            feedback: "Після заміни y = x² інтегруємо ½ cos y на [0, π/2], що дає ½.",
          },
        ],
      },
      {
        id: "q-4-4",
        promptText: "Яка геометрична фігура відповідає Прикладу 2.2: ∫₀¹ √(1 − x²) dx?",
        options: [
          {
            id: "q-4-4-a",
            letter: "A",
            labelText: "Прямокутний трикутник площею 1/2",
            isCorrect: false,
            feedback: "Графік y = √(1 − x²) — це дуга кола x² + y² = 1, а не пряма.",
          },
          {
            id: "q-4-4-b",
            letter: "B",
            labelText: "Чверть одиничного круга площею π/4",
            isCorrect: true,
            feedback: "Точно! Круг радіуса 1 має площу π, а в першій чверті [0, 1] лежить рівно ¼ круга.",
          },
          {
            id: "q-4-4-c",
            letter: "C",
            labelText: "Півколо площею π/2",
            isCorrect: false,
            feedback: "Півколо було б на відрізку [−1, 1], а тут межі [0, 1].",
          },
          {
            id: "q-4-4-d",
            letter: "D",
            labelText: "Параболічний сегмент площею 2/3",
            isCorrect: false,
            feedback: "Рівняння y = √(1 − x²) задає верхню дугу кола, не параболу.",
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* MODULE 5: INTEGRATION BY PARTS                                             */
  /* -------------------------------------------------------------------------- */
  {
    id: "integration-by-parts",
    number: 5,
    shortTitle: "Інтегрування частинами",
    sectionLabel: "Модуль 5 · Теорема 4",
    title: "Інтегрування частинами",
    durationMinutes: 13,
    hook: "Це обернене правило похідної добутку (uv)' = u'v + uv'. Коли під інтегралом зустрічаються «два різні світи» функцій (наприклад, многочлен (2x+1) і експонента eˣ), ми переносимо похідну з одного множника на інший.",
    definition: {
      badge: "Теорема 4",
      title: "Формула інтегрування частинами (3)",
      lead: "Нехай функції u(x) та v(x) диференційовні на відрізку [a, b]. Тоді:",
      formulaLatex:
        "\\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-u}{u(x)}\\,\\htmlClass{var-dv}{v'(x)\\,dx} = \\left.\\htmlClass{var-u}{u(x)}\\,\\htmlClass{var-v}{v(x)}\\right|_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} - \\int_{\\htmlClass{var-a}{a}}^{\\htmlClass{var-b}{b}} \\htmlClass{var-v}{v(x)}\\,\\htmlClass{var-du}{u'(x)\\,dx}",
    },
    sandbox: {
      mode: "by-parts",
      title: "Розкладання інтеграла на uv|ₐᵇ та −∫v·du",
      subtitle:
        "Досліджуй Приклад 3: змінюй коефіцієнт k у (kx + 1)eˣ та межі [a, b], щоб бачити баланс між позаінтегральним членом uv|ₐᵇ і залишковим інтегралом −∫v·du.",
      defaultFunctionId: "ex3-parts",
      defaultN: 16,
      defaultMethod: "mid",
      defaultK: 2,
      functions: [
        {
          id: "ex3-parts",
          label: "(kx + 1)eˣ (Приклад 3)",
          latexLabel: "f(x) = (kx + 1)e^x",
          expr: "(k * x + 1) * exp(x)",
          boundaryTermExpr: "(k * x + 1) * exp(x)",
          residualExpr: "k * exp(x)",
          defaultA: 0,
          defaultB: 1,
          xRange: [-1.2, 1.8],
          yRange: [-1.5, 9.2],
        },
        {
          id: "x-cos-x",
          label: "x·cos(x) (LIATE)",
          latexLabel: "f(x) = x\\cos x",
          expr: "x * cos(x)",
          boundaryTermExpr: "x * sin(x)",
          residualExpr: "sin(x)",
          defaultA: 0,
          defaultB: 3.1416,
          xRange: [-0.6, 3.8],
          yRange: [-3.5, 2.2],
        },
        {
          id: "ln-x",
          label: "ln(x) на [1, e]",
          latexLabel: "f(x) = \\ln x",
          expr: "log(max(0.05, x))",
          boundaryTermExpr: "x * log(max(0.05, x))",
          residualExpr: "1",
          domainMin: 0.1,
          domainMax: 4.5,
          defaultA: 1,
          defaultB: 2.7183,
          xRange: [-0.2, 3.6],
          yRange: [-1.2, 2.2],
        },
      ],
      presets: [
        {
          id: "parts-ex3",
          label: "Приклад 3: (2x+1)eˣ на [0, 1]",
          description: "uv|₀¹ = 3e − 1 ≈ 7.155, мінус залишок ∫₀¹ 2eˣdx = 2e − 2 ≈ 3.437 → разом e + 1 ≈ 3.718!",
          functionId: "ex3-parts",
          a: 0,
          b: 1,
          k: 2,
        },
        {
          id: "parts-k0",
          label: "Що як k = 0?",
          description: "Многочлен вироджується в константу 1: du = 0, залишковий інтеграл зникає, маємо просто ∫₀¹ eˣdx = e − 1.",
          functionId: "ex3-parts",
          a: 0,
          b: 1,
          k: 0,
        },
        {
          id: "parts-xcosx",
          label: "Класика: x·cos(x) на [0, π]",
          description: "u = x, dv = cos x dx: uv|₀^π = 0, а залишок −∫₀^π sin x dx = −2!",
          functionId: "x-cos-x",
          a: 0,
          b: 3.1416,
        },
        {
          id: "parts-lnx",
          label: "Логарифм: ln(x) на [1, e]",
          description: "u = ln x, dv = dx: x ln x|₁^e = e, мінус ∫₁^e 1 dx = e − 1 → рівно 1!",
          functionId: "ln-x",
          a: 1,
          b: 2.7183,
        },
      ],
    },
    theorem: {
      badge: "Алгоритм вибору u (LIATE)",
      title: "Що обрати за u, а що за dv?",
      statement:
        "Головний принцип: бери за u ту частину, яка стає простішою після диференціювання, а за dv — те, що легко інтегрується.",
      formulaLatex:
        "\\text{Пріоритет для } \\htmlClass{var-u}{u}: \\quad \\mathbf{L}\\text{og} \\;\\succ\\; \\mathbf{I}\\text{nv. trig} \\;\\succ\\; \\mathbf{A}\\text{lg } P(x) \\;\\succ\\; \\mathbf{T}\\text{rig} \\;\\succ\\; \\mathbf{E}\\text{xp}",
      bullets: [
        {
          id: "liate-1",
          label: "P(x)·e^(kx), P(x)·cos x",
          latex: "u = P(x), \\quad dv = e^{kx}dx \\;(\\text{або } \\cos x\\,dx)",
        },
        {
          id: "liate-2",
          label: "P(x)·ln x, P(x)·arctg x",
          latex: "u = \\ln x \\;(\\text{або } \\operatorname{arctg} x), \\quad dv = P(x)\\,dx",
        },
      ],
    },
    examples: [
      {
        id: "ex-3-1",
        title: "Приклад 3 (з лекції)",
        sourceRef: "Лекція 11 · Приклад 3",
        problemLatex: "\\int_{0}^{1} (2x + 1)e^x\\,dx",
        finalAnswerLatex: "e + 1 \\approx 3.718",
        steps: [
          {
            id: "bp1-step-1",
            tag: "Крок 1 · Вибір u та dv",
            explanation:
              "Многочлен (2x + 1) беремо за u (його похідна — константа 2), а eˣ dx — за dv.",
            latex:
              "\\htmlClass{step-changed}{\\begin{vmatrix} u = 2x + 1, & du = 2\\,dx \\\\ dv = e^x\\,dx, & v = e^x \\end{vmatrix}}",
          },
          {
            id: "bp1-step-2",
            tag: "Крок 2 · Формула uv|ₐᵇ − ∫v du",
            explanation:
              "Підставляємо u, v, du у формулу (3), не забуваючи межі [0, 1] біля обох частин.",
            latex:
              "\\htmlClass{step-changed}{\\left.(2x + 1)e^x\\right|_{0}^{1}} - \\htmlClass{step-changed}{\\int_{0}^{1} 2e^x\\,dx}",
          },
          {
            id: "bp1-step-3",
            tag: "Крок 3 · Обчислення граничного члена та залишку",
            explanation:
              "При x = 1 маємо 3e¹ = 3e, при x = 0 маємо 1·e⁰ = 1. Залишковий інтеграл табличний: 2eˣ|₀¹.",
            latex:
              "\\htmlClass{step-changed}{3e - e^0} - \\left.2e^x\\right|_{0}^{1} = 3e - 1 - (2e - 2e^0)",
          },
          {
            id: "bp1-step-4",
            tag: "Крок 4 · Зведення подібних доданків",
            explanation:
              "Обережно розкриваємо дужки зі знаком «−»: −(2e − 2) = −2e + 2.",
            latex:
              "3e - 1 - 2e + 2 = \\htmlClass{step-changed}{e + 1}",
          },
        ],
      },
      {
        id: "ex-3-2",
        title: "Класичний тренажер: інтеграл від ln x",
        sourceRef: "Додатковий розбір · Правило LIATE",
        problemLatex: "\\int_{1}^{e} \\ln x\\,dx",
        finalAnswerLatex: "1",
        steps: [
          {
            id: "bp2-step-1",
            tag: "Крок 1 · Обираємо u = ln x",
            explanation:
              "Оскільки табличної первісної для ln x немає, диференціюємо сам логарифм, а за dv беремо 1·dx.",
            latex:
              "\\htmlClass{step-changed}{\\begin{vmatrix} u = \\ln x, & du = \\frac{1}{x}\\,dx \\\\ dv = dx, & v = x \\end{vmatrix}}",
          },
          {
            id: "bp2-step-2",
            tag: "Крок 2 · Застосування формули (3)",
            explanation:
              "Множники x і 1/x у другому інтегралі чудово скорочуються до одиниці!",
            latex:
              "\\left.x\\ln x\\right|_{1}^{e} - \\int_{1}^{e} \\htmlClass{step-changed}{x\\cdot\\frac{1}{x}}\\,dx = \\left.x\\ln x\\right|_{1}^{e} - \\int_{1}^{e} 1\\,dx",
          },
          {
            id: "bp2-step-3",
            tag: "Крок 3 · Фінальна підстановка",
            explanation: "Враховуємо ln e = 1 та ln 1 = 0.",
            latex:
              "(e\\cdot 1 - 1\\cdot 0) - (e - 1) = e - e + 1 = \\htmlClass{step-changed}{1}",
          },
        ],
      },
    ],
    cheatSheet: [
      {
        id: "cs-5-1",
        title: "Формула (3)",
        formulaLatex: "\\int_a^b u\\,dv = \\left.uv\\right|_a^b - \\int_a^b v\\,du",
        hint: "Межі [a, b] ставляться і в uv, і в інтегралі",
      },
      {
        id: "cs-5-2",
        title: "Многочлен × Експонента",
        formulaLatex: "u = P(x), \\quad dv = e^{kx}dx",
        hint: "Похідна знижує степінь многочлена",
      },
      {
        id: "cs-5-3",
        title: "Многочлен × Логарифм",
        formulaLatex: "u = \\ln x, \\quad dv = P(x)\\,dx",
        hint: "Похідна від ln x прибирає логарифм",
      },
      {
        id: "cs-5-4",
        title: "Результат Прикладу 3",
        formulaLatex: "\\int_0^1 (2x+1)e^x\\,dx = e + 1",
        hint: "3e − 1 − (2e − 2) = e + 1",
      },
    ],
    stickyNote: "Слідкуй за мінусом перед другим інтегралом: −(2e − 2) = −2e + 2!",
    quiz: [
      {
        id: "q-5-1",
        promptText: "Що саме варто позначити через u та dv для обчислення інтеграла?",
        promptLatex: "\\int_{0}^{\\pi} x\\cos x\\,dx",
        options: [
          {
            id: "q-5-1-a",
            letter: "A",
            labelLatex: "u = x, \\quad dv = \\cos x\\,dx",
            isCorrect: true,
            feedback: "Точно! Похідна du = dx знищує множник x, і залишковий інтеграл ∫sin x dx стає табличним.",
          },
          {
            id: "q-5-1-b",
            letter: "B",
            labelLatex: "u = \\cos x, \\quad dv = x\\,dx",
            isCorrect: false,
            feedback: "Такий вибір ускладнить інтеграл: v = x²/2 лише підвищить степінь многочлена!",
          },
          {
            id: "q-5-1-c",
            letter: "C",
            labelLatex: "u = x\\cos x, \\quad dv = dx",
            isCorrect: false,
            feedback: "Тоді du = (cos x − x sin x)dx зробить інтеграл ще громіздкішим.",
          },
          {
            id: "q-5-1-d",
            letter: "D",
            labelText: "Тут потрібна заміна t = cos x",
            isCorrect: false,
            feedback: "Похідна від cos x — це −sin x, якого немає поруч; це класичне інтегрування частинами.",
          },
        ],
      },
      {
        id: "q-5-2",
        promptText: "Яким буде значення інтеграла ∫₀^π x cos x dx після завершення обчислень?",
        options: [
          {
            id: "q-5-2-a",
            letter: "A",
            labelLatex: "0",
            isCorrect: false,
            feedback: "Позаінтегральний член x sin x|₀^π справді 0, але залишається −∫₀^π sin x dx!",
          },
          {
            id: "q-5-2-b",
            letter: "B",
            labelLatex: "-2",
            isCorrect: true,
            feedback: "Вірно! 0 − ∫₀^π sin x dx = [cos x]₀^π = cos π − cos 0 = −1 − 1 = −2.",
          },
          {
            id: "q-5-2-c",
            letter: "C",
            labelLatex: "2",
            isCorrect: false,
            feedback: "Загубився знак «−» перед другим інтегралом у формулі uv − ∫v du.",
          },
          {
            id: "q-5-2-d",
            letter: "D",
            labelLatex: "\\pi",
            isCorrect: false,
            feedback: "У граничному члені x sin x при x = π маємо π·sin π = 0.",
          },
        ],
      },
      {
        id: "q-5-3",
        promptText: "У Прикладі 3 (∫₀¹ (2x + 1)eˣ dx) студент отримав 3e − 1 − 2e − 2 = e − 3. Де помилка?",
        options: [
          {
            id: "q-5-3-a",
            letter: "A",
            labelText: "При x = 0 помилково підставили e⁰ = 0",
            isCorrect: false,
            feedback: "Студент підставив e⁰ = 1 правильно (бо отримав −1 і −2), але помилився зі знаком!",
          },
          {
            id: "q-5-3-b",
            letter: "B",
            labelText: "Не розкрито мінус перед дужками: −(2e − 2) має дати −2e + 2",
            isCorrect: true,
            feedback: "Саме так! Найчастіша помилка на модулі — втратити зміну знака на «+2».",
          },
          {
            id: "q-5-3-c",
            letter: "C",
            labelText: "Неправильно знайдено v = eˣ",
            isCorrect: false,
            feedback: "Первісна від eˣ справді дорівнює eˣ.",
          },
          {
            id: "q-5-3-d",
            letter: "D",
            labelText: "Похідна від (2x + 1) дорівнює 2x",
            isCorrect: false,
            feedback: "Похідна від (2x + 1) дорівнює 2, і це було зроблено правильно.",
          },
        ],
      },
      {
        id: "q-5-4",
        promptText: "Що беремо за u при інтегруванні ∫₁² x² ln x dx?",
        options: [
          {
            id: "q-5-4-a",
            letter: "A",
            labelLatex: "u = x^2",
            isCorrect: false,
            feedback: "Якщо взяти dv = ln x dx, то доведеться інтегрувати логарифм замість диференціювати його.",
          },
          {
            id: "q-5-4-b",
            letter: "B",
            labelLatex: "u = \\ln x",
            isCorrect: true,
            feedback: "Правильно! За правилом LIATE логарифм переважає многочлен: du = (1/x)dx знижує x³ до x².",
          },
          {
            id: "q-5-4-c",
            letter: "C",
            labelLatex: "u = x",
            isCorrect: false,
            feedback: "Краще диференціювати весь ln x, тоді v = x³/3 і залишок ∫(x²/3)dx береться миттєво.",
          },
          {
            id: "q-5-4-d",
            letter: "D",
            labelLatex: "u = 1",
            isCorrect: false,
            feedback: "Тоді du = 0, і метод частин не спростить інтеграл.",
          },
        ],
      },
    ],
  },

  /* -------------------------------------------------------------------------- */
  /* MODULE 6: EVEN/ODD FUNCTIONS & LECTURE SUMMARY                             */
  /* -------------------------------------------------------------------------- */
  {
    id: "even-odd-summary",
    number: 6,
    shortTitle: "Парність та підсумок",
    sectionLabel: "Модуль 6 · § 14.8 + Підсумок",
    title: "Парні та непарні функції",
    durationMinutes: 9,
    hook: "Симетрія на відрізку [−a, a] — найкращий чит-код вищої математики. Непарні доданки можна викреслювати в нуль поглядом, а парні — обчислювати лише від нуля до a і множити на 2.",
    definition: {
      badge: "Окремі випадки",
      title: "Інтеграл на симетричному відрізку [−a, a]",
      lead: "Якщо функція інтегровна на симетричному відрізку [−a, a], її парність миттєво спрощує обчислення:",
      formulaLatex:
        "f(-x) = -f(x) \\;(\\text{непарна}) \\implies \\int_{\\htmlClass{var-sym}{-a}}^{\\htmlClass{var-sym}{a}} \\htmlClass{var-fx}{f(x)}\\,dx = 0",
      secondaryFormulaLatex:
        "f(-x) = f(x) \\;(\\text{парна}) \\implies \\int_{\\htmlClass{var-sym}{-a}}^{\\htmlClass{var-sym}{a}} \\htmlClass{var-fx}{f(x)}\\,dx = 2\\int_{0}^{\\htmlClass{var-sym}{a}} \\htmlClass{var-fx}{f(x)}\\,dx",
    },
    sandbox: {
      mode: "symmetry",
      title: "Дзеркало симетрії на [−a, a]",
      subtitle:
        "Порівняй ліву площу на [a, 0] і праву на [0, b]. Спробуй розблокувати симетрію, щоб побачити, як правило миттєво перестає діяти!",
      defaultFunctionId: "odd-x3",
      defaultN: 20,
      defaultMethod: "mid",
      functions: [
        {
          id: "odd-x3",
          label: "x³ (непарна)",
          latexLabel: "f(x) = x^3",
          expr: "x^3",
          parity: "odd",
          defaultA: -1.6,
          defaultB: 1.6,
          xRange: [-2.4, 2.4],
          yRange: [-4.5, 4.5],
        },
        {
          id: "even-x2",
          label: "x² (парна)",
          latexLabel: "f(x) = x^2",
          expr: "x^2",
          parity: "even",
          defaultA: -1.8,
          defaultB: 1.8,
          xRange: [-2.5, 2.5],
          yRange: [-0.8, 4.4],
        },
        {
          id: "odd-sin",
          label: "sin(x) (непарна)",
          latexLabel: "f(x) = \\sin x",
          expr: "sin(x)",
          parity: "odd",
          defaultA: -2.4,
          defaultB: 2.4,
          xRange: [-3.5, 3.5],
          yRange: [-1.5, 1.5],
        },
        {
          id: "mixed-fn",
          label: "x² + x (загальний вигляд)",
          latexLabel: "f(x) = x^2 + x",
          expr: "x^2 + x",
          parity: "neither",
          defaultA: -1.8,
          defaultB: 1.8,
          xRange: [-2.5, 2.5],
          yRange: [-1.2, 6.2],
        },
      ],
      presets: [
        {
          id: "sym-odd",
          label: "Непарна x³ → 0",
          description: "Ліва область (−1.64) і права (+1.64) рівні за модулем і протилежні за знаком: сума рівно 0.",
          functionId: "odd-x3",
          a: -1.6,
          b: 1.6,
          symmetricLock: true,
        },
        {
          id: "sym-even",
          label: "Парна x² → 2×",
          description: "Обидві половини дзеркальні й додатні: інтеграл дорівнює 2 · ∫₀^1.8 x²dx ≈ 3.888.",
          functionId: "even-x2",
          a: -1.8,
          b: 1.8,
          symmetricLock: true,
        },
        {
          id: "sym-broken",
          label: "Зламати симетрію [−1, 1.8]",
          description: "Як тільки межі несиметричні, інтеграл від непарної x³ вже НЕ дорівнює нулю!",
          functionId: "odd-x3",
          a: -1.0,
          b: 1.8,
          symmetricLock: false,
        },
        {
          id: "sym-mixed",
          label: "Змішана x² + x на [−1.8, 1.8]",
          description: "Розкладай лінійно: непарне «x» зникає в 0, залишається лише подвоєне парне 2∫₀^1.8 x²dx!",
          functionId: "mixed-fn",
          a: -1.8,
          b: 1.8,
          symmetricLock: true,
        },
      ],
    },
    theorem: {
      badge: "Підсумок лекції № 11",
      title: "Логіка всієї лекції за 4 кроки",
      statement:
        "Уся тема § 14 будується як послідовний ланцюг від означення до швидких прийомів обчислення:",
      formulaLatex:
        "\\sigma_f(\\bar{\\xi}) \\;\\xrightarrow{|\\tau|\\to 0}\\; \\int_a^b f(x)\\,dx \\;\\xrightarrow{\\text{Т.2}}\\; F(b) - F(a)",
      bullets: [
        {
          id: "sum-1",
          label: "1. Від суми до границі",
          latex: "\\int_a^b f(x)\\,dx = \\lim_{|\\tau|\\to 0} \\sigma_f(\\bar{\\xi})",
        },
        {
          id: "sum-2",
          label: "2. Від границі до первісної",
          latex: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
        },
        {
          id: "sum-3",
          label: "3. Два прийоми обчислення",
          latex: "\\text{Заміна (2) та інтегрування частинами (3)}",
        },
        {
          id: "sum-4",
          label: "4. Симетрія на [−a, a]",
          latex: "\\text{Непарна } \\Rightarrow 0, \\quad \\text{Парна } \\Rightarrow 2\\int_0^a f(x)\\,dx",
        },
      ],
    },
    examples: [
      {
        id: "ex-6-proof",
        title: "Швидкий розрахунок через парність та непарність",
        sourceRef: "§ 14.8 · Застосування симетрії",
        problemLatex: "\\int_{-2}^{2} \\left(x^3\\cos x + 3x^2\\right)\\,dx",
        finalAnswerLatex: "16",
        steps: [
          {
            id: "sym-step-1",
            tag: "Крок 1 · Перевірити симетрію меж",
            explanation:
              "Відрізок [−2, 2] симетричний відносно нуля. Розбиваємо інтеграл на два доданки за лінійністю.",
            latex:
              "\\htmlClass{step-changed}{\\int_{-2}^{2} x^3\\cos x\\,dx} + \\htmlClass{step-changed}{\\int_{-2}^{2} 3x^2\\,dx}",
          },
          {
            id: "sym-step-2",
            tag: "Крок 2 · Занулити непарний доданок",
            explanation:
              "Перевіряємо g(x) = x³ cos x: g(−x) = (−x)³ cos(−x) = −x³ cos x = −g(x) — функція непарна, отже її інтеграл на [−2, 2] дорівнює 0!",
            latex:
              "\\htmlClass{step-changed}{\\int_{-2}^{2} x^3\\cos x\\,dx = 0}",
          },
          {
            id: "sym-step-3",
            tag: "Крок 3 · Подвоїти парний доданок",
            explanation:
              "Функція h(x) = 3x² парна (h(−x) = 3x² = h(x)), тому переходимо до зручного відрізка [0, 2].",
            latex:
              "0 + \\htmlClass{step-changed}{2\\int_{0}^{2} 3x^2\\,dx} = 2\\left.\\left(x^3\\right)\\right|_{0}^{2}",
          },
          {
            id: "sym-step-4",
            tag: "Крок 4 · Миттєва відповідь",
            explanation:
              "Підставляємо 2 та 0 (нижня межа 0 зазвичай зануляє вираз миттєво!).",
            latex:
              "2\\cdot(2^3 - 0^3) = 2\\cdot 8 = \\htmlClass{step-changed}{16}",
          },
        ],
      },
    ],
    cheatSheet: [
      {
        id: "cs-6-1",
        title: "Непарна функція",
        formulaLatex: "\\begin{aligned} &f(-x) = -f(x) \\\\ &\\int_{-a}^{a} f(x)\\,dx = 0 \\end{aligned}",
        hint: "x, x³, sin x, tg x, x·cos x",
      },
      {
        id: "cs-6-2",
        title: "Парна функція",
        formulaLatex: "\\begin{aligned} &f(-x) = f(x) \\\\ &\\int_{-a}^{a} f\\,dx = 2\\int_{0}^{a} f\\,dx \\end{aligned}",
        hint: "1, x², cos x, |x|, x·sin x",
      },
      {
        id: "cs-6-3",
        title: "Правило добутку",
        formulaLatex: "\\begin{aligned} &\\text{непарна} \\times \\text{парна} \\\\ &= \\text{непарна} \\end{aligned}",
        hint: "Працює як знаки (−)·(+) = (−)",
      },
      {
        id: "cs-6-4",
        title: "Заміна для доведення",
        formulaLatex: "\\begin{aligned} &\\int_{-a}^{0} f(x)\\,dx \\\\ &\\stackrel{t=-x}{=} \\int_{0}^{a} f(-t)\\,dt \\end{aligned}",
        hint: "Звідси випливають обидві формули",
      },
    ],
    stickyNote: "Перевіряй симетрію меж [−a, a] ПЕРШ НІЖ інтегрувати!",
    quiz: [
      {
        id: "q-6-1",
        promptText: "Обчисліть усно без знаходження первісної:",
        promptLatex: "\\int_{-5}^{5} \\frac{x^3 \\sin^2 x}{1 + x^4}\\,dx = ?",
        options: [
          {
            id: "q-6-1-a",
            letter: "A",
            labelLatex: "0",
            isCorrect: true,
            feedback: "Блискуче! Чисельник непарний (x³·парна), знаменник парний (1 + x⁴), межі [−5, 5] симетричні ⇒ відповідь 0!",
          },
          {
            id: "q-6-1-b",
            letter: "B",
            labelLatex: "2\\int_0^5 \\frac{x^3\\sin^2 x}{1+x^4}\\,dx",
            isCorrect: false,
            feedback: "Це правило для парної функції, але тут x³ міняє знак при x → −x.",
          },
          {
            id: "q-6-1-c",
            letter: "C",
            labelLatex: "\\frac{25}{2}",
            isCorrect: false,
            feedback: "Шукати первісну тут не потрібно — достатньо перевірити f(−x) = −f(x).",
          },
          {
            id: "q-6-1-d",
            letter: "D",
            labelText: "Неможливо обчислити в елементарних функціях",
            isCorrect: false,
            feedback: "Невизначений інтеграл справді складний, але визначений на [−5, 5] точно дорівнює 0!",
          },
        ],
      },
      {
        id: "q-6-2",
        promptText: "Чи можна стверджувати, що ∫₋₁² x³ dx = 0, оскільки f(x) = x³ — непарна функція?",
        options: [
          {
            id: "q-6-2-a",
            letter: "A",
            labelText: "Так, для будь-якої непарної функції інтеграл дорівнює 0",
            isCorrect: false,
            feedback: "Ні! Інтеграл обнуляється лише на симетричному відрізку [−a, a].",
          },
          {
            id: "q-6-2-b",
            letter: "B",
            labelText: "Ні, бо відрізок [−1, 2] несиметричний відносно нуля",
            isCorrect: true,
            feedback: "Правильно! Частина [−1, 1] справді дасть 0, але залишиться ∫₁² x³ dx = 15/4.",
          },
          {
            id: "q-6-2-c",
            letter: "C",
            labelText: "Так, бо 0 лежить усередині [−1, 2]",
            isCorrect: false,
            feedback: "Одного факту 0 ∈ [a, b] замало — потрібно точно b = −a.",
          },
          {
            id: "q-6-2-d",
            letter: "D",
            labelText: "Ні, бо x³ — парна функція",
            isCorrect: false,
            feedback: "(−x)³ = −x³, тому x³ непарна, але межі [−1, 2] несиметричні.",
          },
        ],
      },
      {
        id: "q-6-3",
        promptText: "Обчисліть значення інтеграла:",
        promptLatex: "\\int_{-\\pi/2}^{\\pi/2} (\\sin x + \\cos x)\\,dx = ?",
        options: [
          {
            id: "q-6-3-a",
            letter: "A",
            labelLatex: "0",
            isCorrect: false,
            feedback: "Зануляється лише непарний sin x; парний cos x подвоюється!",
          },
          {
            id: "q-6-3-b",
            letter: "B",
            labelLatex: "1",
            isCorrect: false,
            feedback: "1 — це ∫₀^(π/2) cos x dx, але потрібно помножити на 2!",
          },
          {
            id: "q-6-3-c",
            letter: "C",
            labelLatex: "2",
            isCorrect: true,
            feedback: "Точно! ∫ sin x = 0, а 2·∫₀^(π/2) cos x dx = 2·(sin(π/2) − 0) = 2.",
          },
          {
            id: "q-6-3-d",
            letter: "D",
            labelLatex: "\\pi",
            isCorrect: false,
            feedback: "Первісна від cos x — це sin x, тому 2·sin(π/2) = 2.",
          },
        ],
      },
      {
        id: "q-6-4",
        promptText: "Яка функція є ПАРНОЮ (інтеграл на [−a, a] подвоюється)?",
        options: [
          {
            id: "q-6-4-a",
            letter: "A",
            labelLatex: "f(x) = x\\cos x",
            isCorrect: false,
            feedback: "(−x)cos(−x) = −x cos x — це непарна функція.",
          },
          {
            id: "q-6-4-b",
            letter: "B",
            labelLatex: "f(x) = x\\sin x",
            isCorrect: true,
            feedback: "Вірно! (−x)sin(−x) = (−x)(−sin x) = +x sin x — добуток двох непарних функцій є парною!",
          },
          {
            id: "q-6-4-c",
            letter: "C",
            labelLatex: "f(x) = x^3 + x",
            isCorrect: false,
            feedback: "Сума двох непарних степенів — непарна функція.",
          },
          {
            id: "q-6-4-d",
            letter: "D",
            labelLatex: "f(x) = e^x",
            isCorrect: false,
            feedback: "e^(−x) ≠ e^x і e^(−x) ≠ −e^x — експонента ні парна, ні непарна.",
          },
        ],
      },
    ],
  },
];
