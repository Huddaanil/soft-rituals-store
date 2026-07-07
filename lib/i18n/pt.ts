import type { Dictionary } from "./en";

// Portuguese (Mozambique / European spelling). Mirrors en.ts exactly.
const pt: Dictionary = {
  nav: {
    shop: "Loja",
    about: "Sobre",
    delivery: "Entregas",
    contact: "Contacto",
    cart: "Carrinho",
    menu: "Menu",
  },
  hero: {
    kicker: "Feito à mão em Maputo",
    titleLine1: "Trabalha demais.",
    titleEm: "Acenda algo.",
    body: "A Soft Rituals faz velas e sabonetes artesanais para quem se esquece de parar. Cinco minutos de calma, esculpidos à mão, vertidos um a um. Pequenos rituais, grande calma.",
    shopCta: "Ver a coleção",
    storyCta: "A nossa história",
  },
  home: {
    browseTitle: "Explorar por ritual",
    viewAll: "Ver tudo",
    featuredTitle: "Os que toda a gente procura",
    shopAll: "Ver toda a loja",
    ideaKicker: "A ideia",
    ideaTitlePre: "Um ritual suave é um pequeno momento ",
    ideaTitleEm: "que guarda só para si.",
    ideaBody:
      "Não é uma grande mudança. Não é uma rotina nova. Uma chama acesa enquanto a chaleira ferve. Um sabonete que cheira a jardim. Uma vela na mesa depois do jantar. Fazemos estas coisas à mão na nossa cozinha em Maputo, para que os seus dias mais ocupados guardem um canto de calma.",
    ideaCta: "Ler a nossa história",
  },
  shop: {
    allTitle: "Todos os produtos",
    allBlurb:
      "Tudo é esculpido, vertido e embrulhado à mão em Maputo — em pequenos lotes, nunca numa fábrica.",
    all: "Todos",
    sort: "Ordenar",
    sortFeatured: "Em destaque",
    sortPriceAsc: "Preço: do mais baixo",
    sortPriceDesc: "Preço: do mais alto",
    sortName: "Nome A–Z",
    productOne: "produto",
    productMany: "produtos",
    emptyPre: "Ainda não há nada aqui — chegam lotes novos com frequência. ",
    emptyLink: "Ver tudo",
  },
  product: {
    breadcrumbShop: "Loja",
    details: "Os detalhes",
    deliveryNote: "Entrega em Maputo combinada pessoalmente após a encomenda",
    alsoLike: "Talvez também goste",
    addToCart: "Adicionar ao carrinho",
    decrease: "Diminuir quantidade",
    increase: "Aumentar quantidade",
  },
  cart: {
    title: "O seu carrinho",
    close: "Fechar",
    empty: "O seu carrinho está vazio — a coisa mais calma do mundo.",
    emptyCta: "Ver a loja",
    subtotal: "Subtotal",
    deliveryNote:
      "A entrega em Maputo é combinada após a encomenda — confirmamos tudo pessoalmente.",
    checkout: "Finalizar encomenda",
    remove: "Remover",
  },
  checkout: {
    title: "Finalizar encomenda",
    intro:
      "Não precisa de conta. Confirmamos cada encomenda pessoalmente antes de qualquer passo.",
    name: "O seu nome",
    namePh: "Maria Santos",
    phone: "Telefone (WhatsApp)",
    phonePh: "+258 84 000 0000",
    email: "Email (opcional)",
    emailPh: "voce@exemplo.com",
    area: "Zona de entrega",
    areaPlaceholder: "Escolha a sua zona em Maputo",
    note: "Nota (opcional)",
    notePh: "É um presente / dia preferido de entrega / algo que devamos saber",
    place: "Confirmar encomenda",
    placing: "A registar a sua encomenda…",
    payNote:
      "O pagamento é na entrega (dinheiro ou M-Pesa). Confirmamos a sua encomenda e o valor da entrega pessoalmente antes de qualquer cobrança.",
    emptyTitle: "O seu carrinho está vazio",
    emptyBody: "Encontre primeiro algo pequeno e calmo.",
    emptyCta: "Ver a loja",
    summaryTitle: "A sua encomenda",
    qty: "Qtd.",
    total: "Total",
    deliveryFee: "Valor da entrega combinado consigo — depende da sua zona.",
    errorGeneric:
      "Algo correu mal do nosso lado. Tente novamente, ou envie-nos mensagem no Instagram @ssoft.rituals.",
  },
  order: {
    thanks: "Obrigada",
    received:
      "A sua encomenda foi recebida. Vamos confirmar tudo pessoalmente — normalmente no mesmo dia — e combinar a entrega consigo.",
    receivedPaid:
      "A sua encomenda foi recebida e o pagamento foi aceite. Vamos confirmar tudo pessoalmente — normalmente no mesmo dia — e combinar a entrega consigo.",
    orderNumber: "Número da encomenda",
    total: "Total",
    payOnDelivery:
      "Pagamento na entrega — dinheiro ou M-Pesa. Valor da entrega combinado consigo.",
    payCard: "Pagamento por cartão. Valor da entrega combinado consigo.",
    keepNumberPre:
      "Guarde este número — e se quiser mudar alguma coisa, basta ",
    keepNumberLink: "enviar-nos mensagem no Instagram",
    waOrderCta: "Fale connosco no WhatsApp sobre esta encomenda",
    waOrderMessage: "Olá Soft Rituals! Escrevo sobre a minha encomenda ",
    keepBrowsing: "Continuar a ver",
  },
  about: {
    kicker: "A nossa história",
    titlePre: "Feito em casa, ",
    titleEm: "com calma.",
    p1: "A Soft Rituals começou numa cozinha em Maputo, com uma panela de cera e muita paciência. As primeiras velas eram para a nossa própria mesa — acesas no fim de dias longos demais, para quem responde a mais um email antes do jantar.",
    p2: "Hoje cada vela continua a ser vertida à mão e cada sabonete continua a ser cortado à mão. As flores são esculpidas pétala a pétala. As caixas de presente são feitas uma a uma. Quando um lote esgota, fazemos mais — devagar, porque é esse o objetivo.",
    p3: "Acreditamos que a cura para um dia barulhento não são as férias que adia sempre. São cinco minutos de calma que realmente tira para si. O nosso trabalho é tornar esses cinco minutos bonitos.",
    cta: "Ver a coleção",
    values: [
      { title: "Vertido à mão", text: "Cada vela vertida uma a uma, nunca numa fábrica." },
      { title: "Pequenos lotes", text: "Fazemos pouco, com frequência — para que tudo seja fresco." },
      { title: "Feito com amor", text: "Cada peça embrulhada e etiquetada à mão, como um presente." },
      { title: "Feito em Maputo", text: "Criado aqui em Moçambique, com amor." },
    ],
  },
  delivery: {
    kicker: "Entregas & encomendas",
    titlePre: "Simples, pessoal, ",
    titleEm: "combinado consigo.",
    intro:
      "Somos uma pequena oficina, não um armazém — e isso é uma vantagem para si. Cada encomenda é confirmada por uma pessoa, embalada à mão e entregue como preferir.",
    faqs: [
      {
        q: "Como funciona a encomenda?",
        a: "Adicione o que gostar ao carrinho e finalize — leva um minuto e não precisa de conta. Depois confirmamos a sua encomenda pessoalmente (normalmente por WhatsApp ou Instagram) antes de qualquer passo, para falar sempre com uma pessoa.",
      },
      {
        q: "Onde entregam?",
        a: "Em Maputo e na Matola, combinado consigo após a encomenda — acertamos juntos o dia, o local e o valor da entrega. Para outras cidades, fale connosco primeiro e veremos o que é possível.",
      },
      {
        q: "Como pago?",
        a: "Na entrega — dinheiro ou M-Pesa. O pagamento por cartão online está para breve; por agora mantemos tudo simples e pessoal.",
      },
      {
        q: "Quanto tempo demora?",
        a: "Se as peças estiverem em stock, normalmente 1 a 3 dias. Se estivermos a fazer um lote fresco para si, dizemos-lhe honestamente quando confirmarmos — o que é feito à mão leva o tempo que leva.",
      },
      {
        q: "Posso encomendar um presente?",
        a: "Sim — tudo segue embrulhado e etiquetado à mão. Diga-nos na nota da encomenda se é um presente e garantimos que chega com esse aspeto, sem preço lá dentro.",
      },
      {
        q: "Como cuidar da vela?",
        a: "Primeira vez: deixe o topo derreter por completo para arder de forma uniforme. Corte o pavio para cerca de 5 mm antes de cada utilização. Nunca deixe uma chama sozinha e mantenha as peças esculpidas longe do sol direto — são de cera, e Maputo é quente.",
      },
    ],
    stillTitle: "Ainda com dúvidas?",
    stillBody:
      "Envie-nos mensagem no Instagram — respondemos pessoalmente, normalmente no mesmo dia.",
    contactCta: "Fale connosco",
  },
  contact: {
    kicker: "Contacto",
    titlePre: "Fale com uma pessoa, ",
    titleEm: "não com um bilhete.",
    body: "Encomendas, ideias de presente, peças personalizadas para eventos, ou só para saber o que há de novo esta semana — envie-nos mensagem no WhatsApp ou no Instagram e respondemos pessoalmente, normalmente no mesmo dia.",
    dmCta: "Mensagem no Instagram — @ssoft.rituals",
    waCta: "Encomendar pelo WhatsApp",
    waMessage: "Olá Soft Rituals! Gostava de fazer uma encomenda.",
    whereTitle: "Onde",
    whereBody:
      "Maputo, Moçambique. Entregas em Maputo e na Matola, combinadas consigo.",
    whenTitle: "Quando",
    whenBody:
      "Respondemos pessoalmente, normalmente no mesmo dia — um pouco mais devagar nos dias de produção.",
  },
  footer: {
    tagline:
      "Velas e sabonetes artesanais de Maputo, Moçambique. Pequenos rituais, grande calma.",
    shopHead: "Loja",
    allProducts: "Todos os produtos",
    infoHead: "Informação",
    aboutUs: "Sobre nós",
    deliveryOrders: "Entregas & encomendas",
    contact: "Contacto",
    findHead: "Onde nos encontrar",
    location: "Maputo, Moçambique",
    rights: "Feito à mão com amor.",
    motto: "Acender. Relaxar. Repetir.",
  },
};

export default pt;
