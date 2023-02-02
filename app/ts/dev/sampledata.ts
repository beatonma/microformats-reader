import { mf2 } from "microformats-parser";
import { ParsedDocument } from "microformats-parser/dist/types";

const SampleHtmlHCard = `
<div class="h-card">
<span class="p-name">Sally Ride</span>
<span class="p-honorific-prefix">Dr.</span>
<span class="p-given-name">Sally</span>
<abbr class="p-additional-name">K.</abbr>
<span class="p-family-name">Ride</span>
<span class="p-honorific-suffix">Ph.D.</span>,
<span class="p-nickname">sallykride</span> (IRC)
<div class="p-org">Sally Ride Science</div>
<img class="u-photo" src="http://example.com/sk.jpg"/>
<a class="u-url" href="http://sally.example.com">w</a>,
<a class="u-email" href="mailto:sally@example.com">e</a>
<div class="p-tel">+1.818.555.1212</div>
<div class="p-street-address">123 Main st.</div>
<span class="p-locality">Los Angeles</span>,
<abbr class="p-region" title="California">CA</abbr>,
<span class="p-postal-code">91316</span>
<div class="p-country-name">U.S.A</div>
<time class="dt-bday">1951-05-26</time> birthday
<div class="p-category">physicist</div>
<div class="p-note">First American woman in space.</div>
</div>`;

const SampleHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <title>beatonma.org</title>
    <meta name="description" content="Things by Michael Beaton"/>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="google-site-verification" content="CsQuYeO7RbwWqq9V-pMt0Bm1bZUBC5Qo0vmJBPZqjPE" />
    <meta name="theme-color" content="#111111">
    <meta name="msapplication-config" content="/static/images/favicon/browserconfig.xml">
    <link rel="apple-touch-icon" sizes="180x180" href="/static/images/favicon/apple-touch-icon.png"/>
    <link rel="icon" type="image/png" href="/static/images/favicon/favicon-32x32.png" sizes="32x32"/>
    <link rel="icon" type="image/png" href="/static/images/favicon/favicon-16x16.png" sizes="16x16"/>
    <link rel="manifest" href="/static/images/favicon/manifest.json"/>
    <link rel="mask-icon" href="/static/images/favicon/safari-pinned-tab.svg" color="#a8186f"/>
    <link rel="shortcut icon" href="/static/images/favicon/favicon.ico"/>
    <link rel="alternate" type="application/rss+xml" title="beatonma.org - Recent" href="/feed/"/>
    <link rel="pgpkey" type="application/pgp-keys" title="Michael Beaton's PGP Public Key" href="https://beatonma.org/key/"/>
    <link rel="webmention" href="/webmention/" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="/static/css/staff-9924a92.min.css" /><link rel="stylesheet" href="/static/css/bma-9924a92.min.css" />
    <style id="local_style">
    </style>
    <script src="/static/js/app-9924a92.min.js" defer type="application/javascript" ></script>
    </head>
    <body>
    <header><div id="loading" class="progressbar"></div>
    <nav>
    <div class="header-row-primary">
    <div class="right">
    <form action="/search/" method="get" id="search_form" role="search">
    <div id="search_bar">
    <label id="search_icon" class="icon material-icons search" for="search" tabindex="0" >
    search
    </label>
    <div id="search_wrapper">
    <input type="search" id="search" name="query" placeholder="Search beatonma.org" aria-label="Search beatonma.org" enterkeyhint="search" autocomplete="off" >
    </div>
    </div>
    <div id="search_suggestions"></div>
    </form>
    </div>
    <div class="left">
    <a href="/static" title="Home"><h1>beatonma.org</h1></a>
    </div>
    </div>
    <div class="header-row-secondary">
    <div id="theme_icon" title="Toggle theme"></div>
    <a href="/apps/">Apps</a>
    <a href="/about/">About</a>
    <a href="/contact/">Contact</a>
    <div class="staff">
    |
    <a class="noanim" href="/XzEvGH2BgdpyH8bT9ZU9hLdGBoKrEh8Hs/">Dashboard</a>
    <a class="noanim" href="/6eg0P9CNBnL0GepUbMLJi5RWQY2sdz0zSQpwA2Cl2q/">Admin</a>
    <div class="menu">
    <div class="menu-title material-icons">add</div>
    <div class="menu-content">
    <a tabindex="-1" href="/6eg0P9CNBnL0GepUbMLJi5RWQY2sdz0zSQpwA2Cl2q/main/app/add/">App</a>
    <a tabindex="-1" href="/6eg0P9CNBnL0GepUbMLJi5RWQY2sdz0zSQpwA2Cl2q/main/article/add/">Article</a>
    <a tabindex="-1" href="/6eg0P9CNBnL0GepUbMLJi5RWQY2sdz0zSQpwA2Cl2q/main/blog/add/">Blog</a>
    <a tabindex="-1" href="/6eg0P9CNBnL0GepUbMLJi5RWQY2sdz0zSQpwA2Cl2q/main/changelog/add/">Changelog</a>
    <a tabindex="-1" href="/6eg0P9CNBnL0GepUbMLJi5RWQY2sdz0zSQpwA2Cl2q/main/note/add/">Note</a>
    </div>
    </div>
    </div>
    </div>
    </nav>
    </header>
    <div id="content_wrapper">
    <div id="content">
    <main>
    <div class="links">
    <span class="links-title">Toys & tools:</span>
    <a href="/webmentions_tester/">Webmention tester</a>
    <a href="/webapp/orbitals/?colors=Red,Blue,Greyscale&background=111111">Orbitals</a>
    <a href="/webapp/metaclock/">Metaclock</a>
    </div>
    <section id="feed">
    <div class="feed h-feed">
    <div id="github_recent" class="feed-item-scrollable"></div>
    <div id="notes" class="feed-item-scrollable"></div>
    <a class="feed-item-card h-entry" href="/app/django-wm/#4.0.0" aria-label="Changelog: Changelog: django-wm 4.0.0" title="Changelog: Changelog: django-wm 4.0.0" data-type="changelog" >
    <div class="image " style="background-color:#1E1E1E;color:#FF4B4B;fill:#FF4B4B;stroke:#FF4B4B;" >
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="stroke-width:0;">
     <path d="m11.21 1.001h3.61v16.649c-1.86.35-3.21.5-4.68.5-4.392 0-6.68-1.99-6.68-5.8 0-3.668 2.429-6.051 6.19-6.051.58 0 1.03.04 1.57.187v-5.485zm0 8.381c-.42-.14-.77-.187-1.211-.187-1.822 0-2.872 1.125-2.872 3.075 0 1.93 1.004 2.97 2.85 2.97.393 0 .723 0 1.233-.1z"/>
     <path d="m20.54 6.555v8.345c0 2.87-.21 4.24-.84 5.43-.59 1.15-1.36 1.87-2.96 2.67l-3.32-1.58c1.58-.75 2.35-1.4 2.84-2.41.52-1.03.68-2.22.68-5.35v-7.105zm-3.6-5.535h3.6v3.691h-3.6z"/>
    </svg>
    </div>
    <div class="text">
    <div class="row">
    <h2 class="title p-name">Changelog: django-wm 4.0.0</h2>
    <time class="date" datetime="25 Nov 2022, 6:47 p.m.">25 Nov 2022</time>
    </div>
    <div class="summary p-summary">A new Wiki, Wagtail support, easier setup.</div>
    </div>
    </a>
    <a class="feed-item-card h-entry" href="/app/django-wm/#3.1.1" aria-label="Changelog: Changelog: django-wm 3.1.1" title="Changelog: Changelog: django-wm 3.1.1" data-type="changelog" >
    <div class="image " style="background-color:#1E1E1E;color:#FF4B4B;fill:#FF4B4B;stroke:#FF4B4B;" >
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="stroke-width:0;">
     <path d="m11.21 1.001h3.61v16.649c-1.86.35-3.21.5-4.68.5-4.392 0-6.68-1.99-6.68-5.8 0-3.668 2.429-6.051 6.19-6.051.58 0 1.03.04 1.57.187v-5.485zm0 8.381c-.42-.14-.77-.187-1.211-.187-1.822 0-2.872 1.125-2.872 3.075 0 1.93 1.004 2.97 2.85 2.97.393 0 .723 0 1.233-.1z"/>
     <path d="m20.54 6.555v8.345c0 2.87-.21 4.24-.84 5.43-.59 1.15-1.36 1.87-2.96 2.67l-3.32-1.58c1.58-.75 2.35-1.4 2.84-2.41.52-1.03.68-2.22.68-5.35v-7.105zm-3.6-5.535h3.6v3.691h-3.6z"/>
    </svg>
    </div>
    <div class="text">
    <div class="row">
    <h2 class="title p-name">Changelog: django-wm 3.1.1</h2>
    <time class="date" datetime="26 Oct 2022, 6:43 p.m.">26 Oct 2022</time>
    </div>
    <div class="summary p-summary">Fixes #43.</div>
    </div>
    </a>
    <a class="feed-item-card h-entry" href="/app/django-wm/#3.1.0" aria-label="Changelog: Changelog: django-wm 3.1.0" title="Changelog: Changelog: django-wm 3.1.0" data-type="changelog" >
    <div class="image " style="background-color:#1E1E1E;color:#FF4B4B;fill:#FF4B4B;stroke:#FF4B4B;" >
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="stroke-width:0;">
     <path d="m11.21 1.001h3.61v16.649c-1.86.35-3.21.5-4.68.5-4.392 0-6.68-1.99-6.68-5.8 0-3.668 2.429-6.051 6.19-6.051.58 0 1.03.04 1.57.187v-5.485zm0 8.381c-.42-.14-.77-.187-1.211-.187-1.822 0-2.872 1.125-2.872 3.075 0 1.93 1.004 2.97 2.85 2.97.393 0 .723 0 1.233-.1z"/>
     <path d="m20.54 6.555v8.345c0 2.87-.21 4.24-.84 5.43-.59 1.15-1.36 1.87-2.96 2.67l-3.32-1.58c1.58-.75 2.35-1.4 2.84-2.41.52-1.03.68-2.22.68-5.35v-7.105zm-3.6-5.535h3.6v3.691h-3.6z"/>
    </svg>
    </div>
    <div class="text">
    <div class="row">
    <h2 class="title p-name">Changelog: django-wm 3.1.0</h2>
    <time class="date" datetime="6 Oct 2022, 6:42 p.m.">06 Oct 2022</time>
    </div>
    <div class="summary p-summary">New config options and bugfixes</div>
    </div>
    </a>
    <a class="feed-item-card h-entry" href="/app/beatonma.org/#2.0" aria-label="Changelog: Changelog: beatonma.org 2.0" title="Changelog: Changelog: beatonma.org 2.0" data-type="changelog" >
    <div class="image cover" style="background-color:#131313;color:#E13255;fill:#E13255;stroke:#E13255; background-image: url(\"/media/app/bc6122.svg\")" >
    </div>
    <div class="text">
    <div class="row">
    <h2 class="title p-name">Changelog: beatonma.org 2.0</h2>
    <time class="date" datetime="19 May 2022, 6:41 p.m.">19 May 2022</time>
    </div>
    <div class="summary p-summary">Fitter. Happier. More productive.</div>
    </div>
    </a>
    <a class="feed-item-card h-entry" href="/app/django-wm/#2.3.0" aria-label="Changelog: Changelog: django-wm 2.3.0" title="Changelog: Changelog: django-wm 2.3.0" data-type="changelog" >
    <div class="image " style="background-color:#1E1E1E;color:#FF4B4B;fill:#FF4B4B;stroke:#FF4B4B;" >
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="stroke-width:0;">
     <path d="m11.21 1.001h3.61v16.649c-1.86.35-3.21.5-4.68.5-4.392 0-6.68-1.99-6.68-5.8 0-3.668 2.429-6.051 6.19-6.051.58 0 1.03.04 1.57.187v-5.485zm0 8.381c-.42-.14-.77-.187-1.211-.187-1.822 0-2.872 1.125-2.872 3.075 0 1.93 1.004 2.97 2.85 2.97.393 0 .723 0 1.233-.1z"/>
     <path d="m20.54 6.555v8.345c0 2.87-.21 4.24-.84 5.43-.59 1.15-1.36 1.87-2.96 2.67l-3.32-1.58c1.58-.75 2.35-1.4 2.84-2.41.52-1.03.68-2.22.68-5.35v-7.105zm-3.6-5.535h3.6v3.691h-3.6z"/>
    </svg>
    </div>
    <div class="text">
    <div class="row">
    <h2 class="title p-name">Changelog: django-wm 2.3.0</h2>
    <time class="date" datetime="28 Mar 2022, 7:17 p.m.">28 March 2022</time>
    </div>
    <div class="summary p-summary">Enables customisable url-to-model resolution.</div>
    </div>
    </a>
    <a class="feed-item-card h-entry" href="/app/django-wm/#2.2.0" aria-label="Changelog: Changelog: django-wm 2.2.0" title="Changelog: Changelog: django-wm 2.2.0" data-type="changelog" >
    <div class="image " style="background-color:#1E1E1E;color:#FF4B4B;fill:#FF4B4B;stroke:#FF4B4B;" >
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="stroke-width:0;">
     <path d="m11.21 1.001h3.61v16.649c-1.86.35-3.21.5-4.68.5-4.392 0-6.68-1.99-6.68-5.8 0-3.668 2.429-6.051 6.19-6.051.58 0 1.03.04 1.57.187v-5.485zm0 8.381c-.42-.14-.77-.187-1.211-.187-1.822 0-2.872 1.125-2.872 3.075 0 1.93 1.004 2.97 2.85 2.97.393 0 .723 0 1.233-.1z"/>
     <path d="m20.54 6.555v8.345c0 2.87-.21 4.24-.84 5.43-.59 1.15-1.36 1.87-2.96 2.67l-3.32-1.58c1.58-.75 2.35-1.4 2.84-2.41.52-1.03.68-2.22.68-5.35v-7.105zm-3.6-5.535h3.6v3.691h-3.6z"/>
    </svg>
    </div>
    <div class="text">
    <div class="row">
    <h2 class="title p-name">Changelog: django-wm 2.2.0</h2>
    <time class="date" datetime="26 Mar 2022, 6:57 p.m.">26 March 2022</time>
    </div>
    <div class="summary p-summary"></div>
    </div>
    </a>
    <a class="feed-item-card h-entry" href="/app/django-wm/#2.1.0" aria-label="Changelog: Changelog: django-wm 2.1.0" title="Changelog: Changelog: django-wm 2.1.0" data-type="changelog" >
    <div class="image " style="background-color:#1E1E1E;color:#FF4B4B;fill:#FF4B4B;stroke:#FF4B4B;" >
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="stroke-width:0;">
     <path d="m11.21 1.001h3.61v16.649c-1.86.35-3.21.5-4.68.5-4.392 0-6.68-1.99-6.68-5.8 0-3.668 2.429-6.051 6.19-6.051.58 0 1.03.04 1.57.187v-5.485zm0 8.381c-.42-.14-.77-.187-1.211-.187-1.822 0-2.872 1.125-2.872 3.075 0 1.93 1.004 2.97 2.85 2.97.393 0 .723 0 1.233-.1z"/>
     <path d="m20.54 6.555v8.345c0 2.87-.21 4.24-.84 5.43-.59 1.15-1.36 1.87-2.96 2.67l-3.32-1.58c1.58-.75 2.35-1.4 2.84-2.41.52-1.03.68-2.22.68-5.35v-7.105zm-3.6-5.535h3.6v3.691h-3.6z"/>
    </svg>
    </div>
    <div class="text">
    <div class="row">
    <h2 class="title p-name">Changelog: django-wm 2.1.0</h2>
    <time class="date" datetime="5 Feb 2022, 5:10 p.m.">05 Feb 2022</time>
    </div>
    <div class="summary p-summary"></div>
    </div>
    </a>
    <a class="feed-item-card h-entry" href="/app/django-wm/#2.0.0" aria-label="Changelog: Changelog: django-wm 2.0.0" title="Changelog: Changelog: django-wm 2.0.0" data-type="changelog" >
    <div class="image " style="background-color:#1E1E1E;color:#FF4B4B;fill:#FF4B4B;stroke:#FF4B4B;" >
    <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="stroke-width:0;">
     <path d="m11.21 1.001h3.61v16.649c-1.86.35-3.21.5-4.68.5-4.392 0-6.68-1.99-6.68-5.8 0-3.668 2.429-6.051 6.19-6.051.58 0 1.03.04 1.57.187v-5.485zm0 8.381c-.42-.14-.77-.187-1.211-.187-1.822 0-2.872 1.125-2.872 3.075 0 1.93 1.004 2.97 2.85 2.97.393 0 .723 0 1.233-.1z"/>
     <path d="m20.54 6.555v8.345c0 2.87-.21 4.24-.84 5.43-.59 1.15-1.36 1.87-2.96 2.67l-3.32-1.58c1.58-.75 2.35-1.4 2.84-2.41.52-1.03.68-2.22.68-5.35v-7.105zm-3.6-5.535h3.6v3.691h-3.6z"/>
    </svg>
    </div>
    <div class="text">
    <div class="row">
    <h2 class="title p-name">Changelog: django-wm 2.0.0</h2>
    <time class="date" datetime="2 Feb 2022, 5:09 p.m.">02 Feb 2022</time>
    </div>
    <div class="summary p-summary"></div>
    </div>
    </a>
    </div>
    <div class="pagination">
    <div class="pagination-group"> </div>
    <div class="pagination-group">
    <div class="tooltip" data-tooltip="Next page">
    <a href="?page=2#feed" title="Next page" class="material-icons">navigate_next</a>
    </div>
    <div class="tooltip" data-tooltip="Last page">
    <a href="?page=10#feed" title="Last page" class="material-icons">last_page</a>
    </div>
    </div>
    </div>
    </section>
    </main>
    </div>
    </div>
    <footer>
    <div class="footer-links">
    <a href="/static">Home</a> |
    <a href="/contact/">Contact</a> |
    <a href="/about/">About</a>
    </div>
    <div data-meta="true">
    <div class="h-card vcard u-url">
    <div class="basic">
    <img loading="lazy" class="u-photo" src="https://beatonma.org/static/images/avatar.jpg" alt="Photo of Michael Beaton" />
    <div class="about">
    <div class="fn p-name">Michael Beaton</div>
    <div class="p-honorific-suffix">BSc</div>
    <div class="p-honorific-prefix">Mr</div>
    <div class="p-nickname">fallofmath</div>
    <div class="p-given-name">Michael</div>
    <div class="p-additional-name">Archibald</div>
    <div class="p-family-name">Beaton</div>
    <div class="p-sort-by">Beaton</div>
    <div class="u-sound">https://beatonma.org/sound/</div>
    <div class="p-gender-identity">NB</div>
    <div class="p-sex">M</div>
    <div class="p-pronouns">He/Him</div>
    <div class="p-x-pronoun-nominative">he</div>
    <div class="p-x-pronoun-oblique">him</div>
    <div class="p-x-pronoun-posessive">his</div>
    <div class="u-uid">https://beatonma.org</div>
    <a href="mailto://michael@beatonma.org" class="u-email"></a>
    <div class="p-tel">+44 1234 567 890</div>
    <div class="p-note">Long hair</div>
    <div class="p-org">beatonma.org</div>
    <div class="p-job-title">Freelance developer</div>
    <div class="p-role">I make stuff</div>
    <div class="p-category">Maker</div>
    <a href="irc://beatonma.org" class="u-impp">Whatsapp</a>
    <div class="p-adr h-adr">
      <div class="p-post-office-box">123</div>
      <span class="p-street-address">456 That Road</span>
      <span class="p-extended-address">Behind the loch</span>
      <span class="p-locality">Inverness</span> |
      <span class="p-region">Scotland</span> |
      <span class="p-country-name">UK</span> |
      <span class="p-postal-code">AB1 2CD</span>
      <div class="p-latitude">57.475</div>
      <div class="p-longitude">-4.225</div>
      <div class="p-altitude">20m</div>
      <div class="p-label">Home</div>
    </div>
    </div>
    </div>
    <div data-meta="true">
    <img loading="lazy" class="u-logo" src="https://beatonma.org/static/images/mb.png" alt="Logo for beatonma.org" width="64"/>
    <time class="dt-bday" datetime="1987-05-16">1987-05-16</time>
    <time class="dt-anniversary" datetime="1987-05-16">1987-05-16</time>
    </div>
    <div id="relme">
    <a rel="me" href="https://beatonma.org" title="Homepage" class="u-url" >
    beatonma.org
    </a>
    <a rel="me" href="https://inverness.io" title="Currently redirects to beatonma.org" >
    inverness.io
    </a>
    <a rel="me" href="https://snommoc.org" title="Back-end for Commons (Android app)" >
    snommoc.org
    </a>
    <a rel="me" href="https://github.com/beatonma" title="Github" >
    Github
    </a>
    <a rel="me" href="https://pypi.org/user/beatonma/" title="PyPi" >
    PyPi
    </a>
    <a rel="me" href="https://play.google.com/store/apps/developer?id=Michael+Beaton" title="Play Store" >
    Play Store
    </a>
    <a rel="me" href="https://google.dev/u/108152021615266872014" title="google.dev profile" >
    google.dev
    </a>
    <a rel="me" href="https://twitter.com/_beatonma" title="Twitter" >
    Twitter
    </a>
    <a rel="me" href="https://beatonma.org/feed" title="RSS feed for beatonma.org" >
    RSS
    </a>
    <a rel="me" href="https://www.last.fm/user/schadenfreude87" title="Last.fm profile" >
    last.fm
    </a>
    <a rel="me" href="https://bandcamp.com/fallofmath" title="Bandcamp profile" >
    Bandcamp
    </a>
    <a rel="me" href="https://userstyles.org/users/365999" title="Userstyles.org profile" >
    Userstyles
    </a>
    <a rel="me" href="https://starcraft2.com/en-gb/profile/2/1/2784180" title="StarCraft II profile" >
    StarCraft II
    </a>
    <a rel="me" href="https://www.duolingo.com/fallofmath" title="Duolingo profile" >
    Duolingo
    </a>
    <a rel="me" href="https://www.thingiverse.com/fallofmath/" title="Thingiverse profile" >
    Thingiverse
    </a>
    <a rel="me" href="https://gravatar.com/beatonma" title="Gravatar profile" >
    Gravatar
    </a>
    </div>
    </div>
    </div>
    </footer>
    </body>
    </html>
`;

export const SampleData = mf2(SampleHtml, { baseUrl: "https://beatonma.org" });
