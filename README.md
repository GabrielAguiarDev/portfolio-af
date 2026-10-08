# Portfólio de Ana Flávia

Next.js App Router, TypeScript e React Three Fiber. Interface em PT-BR; estudos demonstrativos, sem credenciais ou contatos inventados.

## Desenvolvimento

Requer Node.js 20.9 ou posterior. Execute `npm install`, `npm run dev` e abra http://localhost:3000. Valide com `npm run typecheck` e `npm run build`; `npm start` serve a versão de produção.

## Atualizar conteúdo

Edite `src/data/portfolio.ts`: identidade, biografia e projetos estão centralizados. Substitua os campos entre colchetes por informações verificadas. Contatos começam como `null`; serviços vazios devem ser preenchidos somente com serviços reais. Imagens ficam em `public/images` (incluindo o retrato `perfil.png`); logo, ícone e favicon ficam em `public/brand`. A configuração `architect.portrait` reúne caminho, dimensões e texto alternativo; use `null` para restaurar o espaço reservado. Conserve textos alternativos e legendas. Cada slug gera uma página própria em `/projetos/[slug]`. O campo opcional `study` define o tipo de diagrama (`courtyard`, `planes` ou `pavilion`), os três gestos conceituais e a paleta de materiais (nome, cor, intenção e textura esquemática). Omitir esse campo remove essas duas seções. Os diagramas e as amostras são desenhados no código, sem downloads adicionais. O índice da home acompanha a lista de projetos automaticamente.

Configure `NEXT_PUBLIC_SITE_URL` com a URL pública absoluta antes do build de produção. Sem essa variável, o site usa example.com nos metadados e sitemap e bloqueia indexação em robots. Confira título, canonical, créditos e metadados antes de publicar.

## Limitações e transparência

Casa Pátio, Entre Planos e Pavilhão Aberto são estudos fictícios demonstrativos, não obras executadas nem projetos da profissional. As fotografias são referências visuais do Unsplash, sem vínculo com os estudos e sem alegação de autoria; fontes dos downloads, créditos verificados quando disponíveis e licença em `public/images/credits.json`. Confirme créditos nominais e permissão de uso profissional antes de substituir a demonstração por um portfólio real. A referência do Pavilhão Aberto mostra o Pavilhão de Barcelona, com fotos de Vincenzo Biancamano e Sam Serrer; o projeto original é de Ludwig Mies van der Rohe e Lilly Reich ([Fundació Mies van der Rohe](https://miesbcn.com/the-pavilion/)). Cada estudo tem uma planta ampliável na seção de organização espacial e uma galeria separada com duas fotografias distintas. A abertura e a seção de decisões também usam essas referências para compor a leitura editorial. Plantas SVG são esquemáticas, sem escala, dimensionamento ou validade técnica.

A maquete usa geometria real em WebGL, com câmera ortográfica, luz e sombras; não corresponde às fotografias. O código 3D é carregado junto da página. Cada maquete WebGL é montada e desenhada uma vez na inicialização, inclusive fora da tela; depois permanece montada com renderização pausada quando a seção sai da viewport ou a aba é ocultada. A entrada na seção retoma a cena na posição atual do scroll, sem refazer buffers e shaders. A imagem estática permanece até o primeiro frame estar pronto, com a indicação “Preparando a maquete interativa…”. Movimento reduzido, WebGL indisponível ou erro de renderização mostram uma maquete SVG estática. O scroll abre a maquete em camadas; no processo, o volume evolui com aberturas, organização e materiais até a casa completa. O mouse ajusta a perspectiva em dispositivos com ponteiro preciso, com retorno suave ao sair. Em telas menores, a sequência do processo acompanha a própria maquete, antes dos textos empilhados. A renderização sob demanda fica ociosa após a interação. Não há modelo executivo, física ou medição técnica. Fotografias e títulos recebem parallax discreto, e as etapas do processo acompanham a leitura; movimento reduzido desativa essas transformações.

A galeria usa diálogo nativo com foco contido, Escape, setas esquerda/direita, retorno de foco e bloqueio de rolagem. Não há formulário, backend, analytics nem envio de mensagens. Cormorant Garamond e Inter locais em WOFF2, com subconjunto Latin/Latin Extended, pesos variáveis e itálico da serif preservados (licenças OFL em public/images) mantêm o build independente de downloads de fontes.

## Validação

`npm run typecheck` e `npm run build` verificam tipos e geração de produção. Na versão anterior de motion, em 04/10/2026, o coordenador validou no Chromium 20 combinações: larguras de 320, 390, 768 e 1440 pixels, em home, três páginas de projeto e 404; sem overflow horizontal, com um H1 e status HTTP correto. Também verificou setas, Escape, contenção e retorno de foco na galeria; Escape e foco no menu móvel; fallback com movimento reduzido e suspensão de WebGL fora da tela, sem erros JavaScript. A revisão final de assets acrescentou a inspeção visual das fotos e a conferência de fontes únicas nas galerias.

O refinamento de motion foi desenvolvido por Codex (maquete e interação) e Claude (composição editorial e estados de leitura), coordenados pelo Orca. A validação adicional confirmou quatro estados distintos alinhados às etapas, mudança de perspectiva por mouse, ausência de chamadas de desenho WebGL após estabilização, sequência touch sem instrução de mouse e alternativa SVG quando WebGL está indisponível.

## Refinamento editorial — 07/10/2026

As referências de portfólio PDF enviadas pelo usuário orientaram o índice da home, a abertura em imagem e texto, a sequência de diagramas, a composição de decisões e a paleta de intenção. Não foram copiados retrato, credenciais, contatos, projetos ou imagens da autora das referências. A identidade de Ana Flávia e as interações 3D existentes foram preservadas.

Nesta revisão, typecheck e build passaram. O HTML gerado de home, três projetos e 404 foi conferido quanto a um H1/main por página, idioma PT-BR, IDs únicos, títulos associados, âncoras existentes, alt de imagens, arquivos de imagem e botão de ampliação de cada planta. O sandbox bloqueou a conexão com o Orca (EPERM), o servidor local (listen EPERM) e o Chromium (sandbox_parameters_mac): não houve nova validação visual, de overflow ou de interações no navegador nesta sessão. Execute `npm run dev` em um terminal local para inspecionar a nova composição e repetir as verificações de desktop/mobile e teclado antes de publicar.

## Carregamento 3D antecipado — 08/10/2026

O carregamento não depende mais de IntersectionObserver. O observer controla apenas atividade, sem desmontar as cenas. O loop usa `demand` durante a preparação e as interações, e `never` fora da tela após o primeiro frame. Movimento reduzido e falhas de WebGL mantêm a vista estática. Essa mudança antecipa o custo de download e inicialização das cenas e mantém os contextos WebGL em memória enquanto a página estiver aberta.

Tipos e build passaram nesta revisão. Um teste isolado com mocks de React/R3F verificou montagem antes da viewport, permanência ao sair, pausa em aba oculta, fallback de movimento reduzido/WebGL indisponível, transição demand → never → demand e callback de primeiro frame (adiado, único e cancelado no cleanup). Esse teste não valida desenho real na GPU ou interação visual no navegador; essa conferência continua pendente no ambiente local.

## Navegação, notebooks e retrato — 08/10/2026

A marca e o link de início do rodapé retornam explicitamente ao topo na home, inclusive após navegar por âncoras; movimento reduzido usa retorno imediato. Cliques com modificadores preservam a abertura nativa em outra aba. Cada estudo da home tem imagem e título com link, além de um botão visível “Ver projeto completo”; a antiga sobreposição invisível sobre o artigo foi removida. Em desktops com até 950px de altura, a imagem e a ficha compartilham a altura disponível, com tipografia e espaços menores. O artigo continua crescendo quando o texto ou zoom exigir, sem ocultar informações. No mobile, as fotos usam proporção 5:4 e a leitura permanece empilhada.

A página 404 conserva cabeçalho, rodapé e linguagem editorial, com acesso ao início e aos projetos; slugs de projeto desconhecidos também acionam `notFound()`. Os originais enviados foram movidos para `public/brand/logo.png`, `public/brand/icon.png` e `public/images/perfil.png`. O retrato substitui o placeholder da seção Sobre; o favicon continua usando o ícone da arquiteta.

Build e typecheck passaram. O HTML gerado confirmou os acessos pela imagem e pelo botão nos três projetos, um H1 em home/404, links de recuperação da 404, retrato e arquivos nas novas pastas. Um teste isolado verificou o handler de retorno ao topo, movimento reduzido, modificadores e preservação da navegação entre páginas. Não substitui validação real de scroll, status HTTP ou layout: a inspeção visual em notebook/mobile continua pendente porque o sandbox bloqueia navegador e servidor local.

## Ajustes de composição — 08/10/2026

A planta na home recupera a sobreposição sobre a fotografia no desktop, inclusive em notebooks. Sua proporção 7:5 é preservada, sem a moldura panorâmica que diminuía o desenho; o fundo usa o papel do site. No mobile ela permanece no fluxo, com largura maior. Imagem e legenda dão acesso direto à organização espacial na página do projeto, onde o desenho pode ser ampliado. A seção Sobre alinha texto e retrato no topo, com biografia, títulos e espaçamento da ficha reduzidos para aproveitar a altura disponível. Não há cortes de conteúdo nem alturas fixas na ficha. Build passou e o HTML confirmou o destino da nova âncora; validação visual continua pendente pelas restrições do ambiente.

## Espaçamento vertical — 08/10/2026

Os intervalos gerais agora usam a altura da viewport (`svh`), com limites em `rem`: `--section` controla a home e `--project-space` as páginas de projeto e suas âncoras. Foram reduzidos os intervalos após cabeçalhos, índice, estudo volumétrico, projetos e galerias. A 404 usa a altura disponível abaixo do cabeçalho, com padding moderado e título limitado também pela altura da tela; o conteúdo é centralizado verticalmente e continua crescendo em telas muito baixas ou com zoom. Build passou com verificação de tipos. A revisão visual no navegador segue indisponível neste sandbox.

A planta auxiliar foi refinada novamente: largura máxima de 15rem, posicionamento no canto inferior externo da fotografia e apenas uma pequena interseção com a imagem. A legenda foi encurtada para “Ver planta”, preservando o acesso ao desenho ampliável na página do projeto. No mobile a folha fica no fluxo, também com largura limitada. Build e tipos passaram; a revisão visual continua dependente do navegador local.

## Seções com área de uma tela — 08/10/2026

Conforme o ajuste de direção do usuário, seções curtas agora têm altura mínima igual à viewport estável menos o cabeçalho (`--screen-content`). O conteúdo fica centralizado verticalmente dentro dessa área, em vez de depender de grandes paddings. A regra cobre as seções da home, abertura e seções das páginas de projeto, galeria de referências e 404. Conteúdo maior continua ampliando a seção, sem corte ou scroll interno. As âncoras posicionam o começo da seção abaixo do cabeçalho, preservando essa composição. A rolagem é nativa e não há snap obrigatório: durante a passagem entre seções, partes das duas podem aparecer. Build e tipos passaram; inspeção visual permanece limitada pelo sandbox.

A planta auxiliar foi removida da home a pedido do usuário. A apresentação inicial prioriza a fotografia e o acesso ao estudo completo. Plantas e ampliação continuam disponíveis na seção Organização espacial das páginas de projeto. As seções curtas mantêm a altura mínima de uma tela com conteúdo centralizado.

## Permanência da última etapa — 08/10/2026

No desktop com movimento habilitado, o fim da lista de processo reserva um trecho adicional de rolagem, limitado entre 16rem e 32rem e orientado por 55svh. Isso prolonga a área em que a maquete fica sticky: o passo 04 pode subir e o estado final com materiais permanece visível antes da saída. A progressão 3D continua ligada aos centros das quatro etapas; a reserva fica fora dos itens e não atrasa o término da animação. Mobile e movimento reduzido preservam o fluxo anterior. Build e tipos passaram; a duração visual real deve ser conferida no navegador local.

A permanência final passou a ser medida dinamicamente por `useProcessBoundary`: altura da maquete e legenda + posição sticky − altura do cabeçalho − altura do último item − borda inferior da lista. Com isso, a maquete começa a sair exatamente quando a linha superior do passo 04 alcança a base do cabeçalho. ResizeObserver acompanha mudanças de texto, legenda, fontes e tamanho; resize acompanha a viewport. A animação continua encerrando no centro do último passo, antes da saída. Mobile e movimento reduzido não usam essa reserva. Build/tipos passaram e um teste isolado verificou coincidência do limite, mudança de dimensões, media query e limpeza dos observers/listeners. A inspeção visual ainda depende do navegador local.

## Permanência da apresentação — 08/10/2026

A seção Sobre ganhou uma permanência curta no desktop: o conjunto de retrato e apresentação fica sticky abaixo do cabeçalho por uma reserva de rolagem de 40svh, limitada entre 12rem e 24rem, antes de seguir no fluxo. O conteúdo mantém dimensões e centralização. A regra só se aplica a partir de 900px de largura e 600px de altura com movimento habilitado; mobile, telas muito baixas e movimento reduzido seguem a apresentação estática. Conteúdo mais alto aumenta a área naturalmente, sem recorte. Build e tipos passaram; conferência visual permanece limitada pelo ambiente.

## Correção da altura mínima — 08/10/2026

A permanência sticky adicionada à seção Sobre foi removida. A altura mínima compartilhada pelas seções passa a ser `100svh`, sem descontar o cabeçalho. O conteúdo permanece centralizado, com rolagem natural e crescimento quando necessário. Essa instrução substitui as descrições anteriores de permanência da seção Sobre e altura mínima descontando o cabeçalho. A sequência sticky do processo mantém seu comportamento próprio.

## Favicon refinado — 08/10/2026

O favicon usa o monograma original centralizado em fundo #F4F1EB, com margem transparente externa e cantos arredondados. Foram gerados SVG, PNG 32px, ICO e ícone Apple 180px em `public/brand`, preservando os originais de identidade. Os metadados usam URLs versionadas (`v=2`) para evitar reutilização do favicon anterior em cache. A composição foi inspecionada como imagem local e o build/tipos passaram; o HTML confirma as quatro referências de ícone.

## Menu mobile — 08/10/2026

O menu mobile usa transições curtas de recorte, opacidade e deslocamento na abertura e no fechamento. Os quatro links entram com intervalos de 35ms. O estado fechado usa `inert` no mobile, além de visibility/pointer-events, impedindo foco e interação durante o fechamento; no desktop os links permanecem acessíveis. Escape e seleção de um link fecham o menu e devolvem o foco ao botão. Movimento reduzido remove as transições e seus atrasos. O menu limita sua altura à viewport e permite rolagem interna em telas baixas. Build/tipos passaram; a interação visual real continua pendente pelas restrições de navegador do ambiente.

O fechamento do menu foi corrigido com um estado separado de visibilidade: ao fechar, o painel permanece desenhado durante a transição de 300ms e só é ocultado após 320ms. O fechamento usa fade e deslocamento com curva suave, mantendo o recorte aberto durante a saída. A interação é desativada imediatamente por inert/pointer-events; reabrir cancela o timer anterior. Movimento reduzido e desktop não aguardam esse timer. Build/tipos e um teste isolado do ciclo de visibilidade passaram; a inspeção visual segue pendente no navegador local.
