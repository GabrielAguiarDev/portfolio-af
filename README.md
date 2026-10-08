# Portfólio de Ana Flávia

Site de arquitetura e interiores em português brasileiro, construído com Next.js, TypeScript, Motion e React Three Fiber.

## Desenvolvimento

Requer Node.js 20.9 ou posterior.

- `npm install`: instala as dependências.
- `npm run dev`: inicia o ambiente de desenvolvimento em http://localhost:3000.
- `npm run typecheck`: verifica os tipos.
- `npm run build`: gera a versão de produção.
- `npm start`: inicia a versão de produção.

## Conteúdo e imagens

Identidade, biografia, contatos e projetos estão centralizados em `src/data/portfolio.ts`. Cada projeto gera uma página em `/projetos/[slug]`, e a home acompanha a lista automaticamente. Campos sem informações devem permanecer vazios; contatos começam como `null` e serviços só devem ser preenchidos quando confirmados.

Fotografias, plantas e retrato ficam em `public/images`. A configuração `architect.portrait` define caminho, dimensões e texto alternativo; use `null` para exibir o espaço reservado. Logo, monograma e versões do favicon ficam em `public/brand`. Preserve as legendas e os textos alternativos ao substituir imagens.

O campo opcional `study` define o diagrama conceitual (`courtyard`, `planes` ou `pavilion`), os três gestos do estudo e a paleta de materiais. Omitir o campo remove essas apresentações.

## Apresentação e interação

As seções têm altura mínima de `100svh`, sem descontar o cabeçalho, e crescem conforme o conteúdo. A rolagem é nativa. O menu mobile oferece abertura e fechamento suaves, fechamento com Escape e navegação por teclado. Movimento reduzido desativa as transições.

As maquetes demonstrativas usam geometria WebGL e são preparadas na inicialização. A renderização pausa fora da tela ou quando a aba está oculta. O scroll revela a organização e os materiais; o mouse ajusta discretamente a perspectiva. A seção de processo mantém a maquete fixa até a linha superior da última etapa alcançar a base do cabeçalho. Mobile usa uma sequência simplificada. Movimento reduzido, WebGL indisponível ou falha de renderização mantêm a alternativa SVG estática.

As páginas individuais incluem planta ampliável e galeria de referências. A ampliação permite Escape, setas, contenção de foco e retorno ao elemento que a abriu. A página 404 oferece acesso ao início e aos projetos.

## Materiais demonstrativos e créditos

Casa Pátio, Entre Planos e Pavilhão Aberto são estudos fictícios, não construídos. As fotografias são referências visuais do Unsplash, sem vínculo com esses estudos nem alegação de autoria da arquiteta. Fontes, créditos e licença estão em `public/images/credits.json`. As referências do Pavilhão Aberto mostram o Pavilhão de Barcelona, de Ludwig Mies van der Rohe e Lilly Reich, com fotografias de Vincenzo Biancamano e Sam Serrer. [Informações sobre o pavilhão](https://miesbcn.com/the-pavilion/).

As plantas são esquemáticas, sem escala ou validade técnica. As maquetes não representam as fotografias. Substitua os materiais demonstrativos por registros reais e revise os créditos antes de publicar o portfólio profissional.

Cormorant Garamond e Inter são carregadas localmente em WOFF2. As licenças estão em `public/images/Cormorant-OFL.txt` e `public/images/Inter-OFL.txt`.

## Publicação e validação

O endereço público padrão é `https://portfolio-af-ruby.vercel.app`. Ao usar outro domínio, configure `NEXT_PUBLIC_SITE_URL` com a URL pública absoluta antes do build. Metadados, URLs canônicas, robots e sitemap usam esse endereço.

A prévia de compartilhamento da home inclui nome, profissão, localização, descrição e um cartão de 1200 × 630 pixels com o retrato de `architect.portrait`, gerado em `/og` durante o build. As páginas de projetos usam título, descrição e imagem próprios. Os campos Open Graph e Twitter permitem prévias em aplicativos como WhatsApp e redes sociais, seguindo a [API de imagens do Next.js](https://nextjs.org/docs/app/api-reference/functions/image-response). Após publicar alterações, prévias já compartilhadas podem manter o conteúdo anterior em cache.

Revise contatos, títulos, descrições, créditos e dados profissionais antes da publicação. Não há formulário de envio, backend ou analytics; o contato usa canais diretos quando configurados.

Além de tipos e build, confira desktop e mobile, navegação por teclado, movimento reduzido, carregamento das maquetes, ampliação de desenhos e comportamento da 404 no navegador. A validação de tipos e produção não substitui essa conferência visual.
