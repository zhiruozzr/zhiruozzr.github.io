---
permalink: /
title: ""
excerpt: "I received my Ph.D. in Economics and Econometrics from Adelaide University in August 2026.; joining the Reserve Bank of New Zealand in September 2026."
layout: single
author_profile: false
sitemap: true
redirect_from:
/about/
/about.html
---
<style>
:root {
  --zz-ink: #20272d;
  --zz-muted: #68737d;
  --zz-accent: #1d5967;
  --zz-accent-dark: #154550;
  --zz-warm: #8a4a52;
  --zz-line: #e8ecef;
  --zz-soft: #f7f9fa;
}

/* Wider, cleaner single-column homepage */
.page { float: none !important; width: 100% !important; padding-right: 0 !important; }
.page__inner-wrap { max-width: 900px; margin: 0 auto; }
.page__content { font-size: 0.96rem; color: var(--zz-ink); }
.page__content p { line-height: 1.72; }
.page__content a { color: var(--zz-accent); }
.page__content a:hover { color: var(--zz-accent-dark); }

/* Profile header inspired by the reference site, but kept more editorial/minimal */
.profile-header { margin: .25rem 0 2.4rem; }
.profile-header::after { content: ""; display: block; clear: both; }
.profile-pic {
  float: right;
  width: 205px;
  max-width: 34%;
  margin: .15rem 0 1.1rem 2rem;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 5px 20px rgba(24, 38, 48, .10);
}
.profile-name {
  margin: 0 0 .2rem;
  font-size: 2rem;
  line-height: 1.16;
  font-weight: 700;
  letter-spacing: -.025em;
  color: var(--zz-ink);
}
.profile-cn {
  font-size: .95rem;
  font-weight: 500;
  color: var(--zz-muted);
  letter-spacing: .02em;
}
.profile-role {
  margin: .35rem 0 .9rem;
  color: var(--zz-accent);
  font-size: 1rem;
  font-weight: 650;
}
.profile-next {
  display: inline-block;
  margin: 0 0 1rem;
  padding: .33rem .7rem;
  border-radius: 999px;
  background: #eef5f6;
  color: var(--zz-accent-dark);
  font-size: .79rem;
  font-weight: 650;
  letter-spacing: .01em;
}
.about-text { max-width: 620px; }
.about-text p { margin: 0 0 .72rem; }

.link-row {
  display: flex;
  flex-wrap: wrap;
  gap: .48rem;
  margin-top: 1.1rem;
}
.profile-link {
  display: inline-flex;
  align-items: center;
  padding: .31rem .72rem;
  border: 1px solid #cbd5da;
  border-radius: 999px;
  color: var(--zz-ink) !important;
  font-size: .78rem;
  font-weight: 650;
  text-decoration: none !important;
  transition: border-color .15s ease, background .15s ease, color .15s ease;
}
.profile-link:hover {
  border-color: var(--zz-accent);
  background: var(--zz-accent);
  color: #fff !important;
}
.profile-link.cv {
  border-color: var(--zz-warm);
  color: var(--zz-warm) !important;
}
.profile-link.cv:hover { background: var(--zz-warm); color: #fff !important; }

/* Section system */
.section-anchor { scroll-margin-top: 90px; }
.section-title {
  margin: 2.75rem 0 1rem;
  padding-bottom: .42rem;
  border-bottom: 1px solid var(--zz-line);
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -.015em;
  color: var(--zz-ink);
}
.section-kicker {
  display: block;
  margin-bottom: .18rem;
  color: var(--zz-accent);
  font-size: .68rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: .12em;
}

/* Research cards */
.research-card {
  margin: 0 0 1rem;
  padding: 1rem 1.15rem 1.05rem;
  border: 1px solid var(--zz-line);
  border-left: 3px solid var(--zz-accent);
  border-radius: 7px;
  background: #fff;
}
.research-card.featured { background: var(--zz-soft); }
.paper-label {
  margin-bottom: .22rem;
  color: var(--zz-warm);
  font-size: .67rem;
  font-weight: 750;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.paper-title {
  margin: 0 0 .18rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.38;
  color: var(--zz-ink);
}
.paper-meta {
  margin-bottom: .55rem;
  color: var(--zz-muted);
  font-size: .82rem;
}
.paper-abstract {
  margin: 0;
  color: #48525a;
  font-size: .88rem;
  line-height: 1.62;
}
.paper-links { margin-top: .68rem; }
.paper-link {
  display: inline-block;
  margin-right: .38rem;
  padding: .16rem .55rem;
  border: 1px solid #cbd5da;
  border-radius: 5px;
  color: var(--zz-accent) !important;
  font-size: .72rem;
  font-weight: 700;
  text-decoration: none !important;
}
.paper-link:hover { border-color: var(--zz-accent); background: var(--zz-accent); color: #fff !important; }

/* Timeline */
.timeline { margin-top: .2rem; }
.timeline-item {
  display: flex;
  gap: 1.1rem;
  padding: .62rem 0;
  border-bottom: 1px solid #eff1f2;
}
.timeline-item:last-child { border-bottom: 0; }
.timeline-date {
  flex: 0 0 118px;
  color: var(--zz-accent);
  font-size: .78rem;
  font-weight: 700;
}
.timeline-body {
  flex: 1;
  color: #46515a;
  font-size: .88rem;
  line-height: 1.55;
}

/* Contact */
.contact-box {
  margin-top: .6rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--zz-line);
  border-radius: 7px;
  background: var(--zz-soft);
}
.contact-box p { margin: 0 0 .4rem; }
.contact-box p:last-child { margin-bottom: 0; }

@media (max-width: 700px) {
  .page__inner-wrap { max-width: 100%; }
  .profile-pic {
    float: none;
    display: block;
    width: 175px;
    max-width: 58%;
    margin: 0 0 1.25rem;
  }
  .profile-name { font-size: 1.75rem; }
  .about-text { max-width: none; }
  .timeline-item { display: block; }
  .timeline-date { margin-bottom: .22rem; }
}
<span class="section-anchor" id="about"></span>
<div class="profile-header">
  <img class="profile-pic" src="/images/IMG_5869.jpeg" alt="Zhiruo Zhang" />
<div class="profile-name">Zhiruo (Rachel) Zhang <span class="profile-cn">张芷若</span></div>
  <div class="profile-role">Ph.D. Candidate in Economics and Econometrics · Adelaide University</div>
  <div class="profile-next">Joining the Reserve Bank of New Zealand · 21 September 2026</div>
<div class="about-text">
    <p>I am a final-year Ph.D. candidate in Economics and Econometrics at Adelaide University, supervised by <a href="https://sites.google.com/view/firmindokotchatoka/home" target="_blank">Prof. Firmin Doko Tchatoka</a> and <a href="https://sites.google.com/site/qazigmziaulhaque/" target="_blank">A/Prof. Qazi Haque</a>.</p>
    <p>I am a <strong>macroeconometrician</strong> working in Bayesian econometrics, time-series econometrics, and panel data econometrics. My research focuses on macroeconomic and financial forecasting, Bayesian learning, machine learning methods, and high-dimensional economic data.</p>
  </div>
<div class="link-row">
    <a class="profile-link" href="mailto:zhiruo.zhang@adelaide.edu.au">Email</a>
    <a class="profile-link" href="https://www.linkedin.com/in/zhiruo-zhang-016b86179/" target="_blank">LinkedIn</a>
    <a class="profile-link" href="https://orcid.org/0000-0002-4887-3068" target="_blank">ORCID</a>
    <a class="profile-link" href="https://github.com/zhiruozzr" target="_blank">GitHub</a>
    <a class="profile-link cv" href="/files/CV_JM.pdf" target="_blank">CV</a>
  </div>
</div>
<span class="section-anchor" id="news"></span>
<div class="section-title"><span class="section-kicker">Updates</span>News</div>
<div class="timeline">
  <div class="timeline-item">
    <div class="timeline-date">21 Sep 2026</div>
    <div class="timeline-body">Joining the <strong>Reserve Bank of New Zealand</strong>.</div>
  </div>
  <div class="timeline-item">
    <div class="timeline-date">24–27 Nov 2026</div>
    <div class="timeline-body">Presenting at the <a href="https://adelaide.edu.au/about/events/2026/2026-econometric-society-australasia-meeting-esam/" target="_blank"><strong>2026 Econometric Society Australasia Meeting (ESAM)</strong></a>, Adelaide University, City East Campus.</div>
  </div>
</div>
<span class="section-anchor" id="research"></span>
<div class="section-title"><span class="section-kicker">Selected work</span>Research</div>
<div class="research-card featured">
  <div class="paper-label">Featured paper</div>
  <div class="paper-title">Adaptive Bayesian Shrinkage of High-Dimensional Panel VARs</div>
  <div class="paper-meta">with Firmin Doko Tchatoka and Qazi Haque</div>
  <p class="paper-abstract">This paper develops a Bayesian framework for estimating high-dimensional panel vector autoregressions using adaptive shrinkage and variable selection. The approach accommodates cross-sectional interdependence and unit-specific heterogeneity, performs well in Monte Carlo experiments, and delivers stable forecasts and economically interpretable evidence on financial contagion in euro-area sovereign bond markets.</p>
  <div class="paper-links">
    <a class="paper-link" href="/files/Adaptive.pdf" target="_blank">Paper</a>
    <a class="paper-link" href="/files/Adaptive_Slides.pdf" target="_blank">Slides</a>
  </div>
</div>
<div class="research-card">
  <div class="paper-title">Bayesian Network Estimation for High-Dimensional Panel VARs</div>
  <div class="paper-meta">with Firmin Doko Tchatoka and Qazi Haque</div>
  <p class="paper-abstract">This project develops a Bayesian Graphical Network Lasso for sparse precision-matrix estimation in high-dimensional PVARX models. The framework identifies contemporaneous conditional dependencies in an order-invariant way and is applied to international transmission of natural-disaster shocks across high-income economies.</p>
</div>
<div class="research-card">
  <div class="paper-title">Disentangling Spillover Networks and Transmission Channels in Panel VARs</div>
  <p class="paper-abstract">This paper proposes a bi-level spike-and-slab framework that selects both bilateral country-pair spillovers and the variables operating within active links. An EM-based algorithm makes the non-convex model practical in high dimensions and reveals a sparse, structured global macroeconomic network with interpretable transmission channels.</p>
</div>
<div class="section-title"><span class="section-kicker">Ongoing</span>Work in Progress</div>
<div class="research-card">
  <div class="paper-title">Structural Transformation, Green Technology, and Labor Reallocation</div>
  <div class="paper-meta">with <a href="https://researchers.adelaide.edu.au/profile/xiyu.ni" target="_blank">Xiyu Ni</a></div>
</div>
<span class="section-anchor" id="contact"></span>
<div class="section-title"><span class="section-kicker">Get in touch</span>Contact</div>
<div class="contact-box">
  <p>Email is the best way to reach me: <a href="mailto:zhiruo.zhang@adelaide.edu.au"><strong>zhiruo.zhang@adelaide.edu.au</strong></a>.</p>
  <p>You can also find me on <a href="https://www.linkedin.com/in/zhiruo-zhang-016b86179/" target="_blank">LinkedIn</a>, <a href="https://orcid.org/0000-0002-4887-3068" target="_blank">ORCID</a>, and <a href="https://github.com/zhiruozzr" target="_blank">GitHub</a>.</p>
</div>
