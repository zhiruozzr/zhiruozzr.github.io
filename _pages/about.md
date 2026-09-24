---
permalink: /
title: ""
excerpt: "Senior Analyst at the Reserve Bank of New Zealand; Ph.D. in Economics and Econometrics from Adelaide University."
author_profile: false
sitemap: true
redirect_from:
  - /about/
  - /about.html
---

<style>
/* =========================================================
   RBNZ-inspired colour palette
   ========================================================= */
:root {
  --rbnz-black: #111111;
  --rbnz-dark: #333333;
  --rbnz-red: #D50057;
  --rbnz-red-dark: #A90045;
  --light-grey: #f0f0f0;
  --card-bg: #fafbfc;
}
/* =========================================================
   Profile header
   ========================================================= */
.profile-header {
  margin: .3em 0 1.4em;
}
.profile-header::after {
  content: "";
  display: block;
  clear: both;
}
.profile-pic {
  float: right;
  width: 220px;
  max-width: 40%;
  border-radius: 10px;
  margin: .2em 0 1em 1.6em;
  box-shadow: 0 4px 18px rgba(0,0,0,.14);
}
.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #222;
  line-height: 1.2;
  margin: 0 0 .12em;
}
.profile-role {
  font-size: 1rem;
  font-weight: 600;
  color: var(--rbnz-black);
  margin-bottom: .35em;
}
.profile-degree {
  font-size: .9rem;
  font-weight: 600;
  color: var(--rbnz-red);
  margin-bottom: .85em;
}
.about-text {
  text-align: justify;
  font-size: .95rem;
  line-height: 1.65;
}
/* =========================================================
   Research interests
   ========================================================= */
.research-interests {
  margin-top: .9em;
  font-size: .9rem;
  line-height: 1.65;
  color: #333;
}
.research-interests strong {
  color: var(--rbnz-black);
}
/* =========================================================
   Social buttons
   ========================================================= */
.social-row {
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.social-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: .8rem;
  font-weight: 600;
  text-decoration: none;
  padding: .35em .85em;
  border-radius: 20px;
  border: 1px solid var(--rbnz-black);
  color: var(--rbnz-black);
  transition: background .2s ease, color .2s ease;
}
.social-chip:hover {
  background: var(--rbnz-black);
  color: #fff;
  text-decoration: none;
}
.social-chip.orcid {
  border-color: #A6CE39;
  color: #5e7d11;
}
.social-chip.orcid:hover {
  background: #A6CE39;
  color: #fff;
}
.cv-button {
  display: inline-block;
  margin-top: .2em;
  font-size: .82rem;
  font-weight: 600;
  padding: .3em .9em;
  border-radius: 6px;
  border: 1px solid var(--rbnz-red);
  color: var(--rbnz-red);
  text-decoration: none;
  transition: background .2s ease, color .2s ease;
}
.cv-button:hover {
  background: var(--rbnz-red);
  color: #fff;
  text-decoration: none;
}
/* =========================================================
   Section headings
   ========================================================= */
.page__content h1 {
  border-bottom: 2px solid var(--rbnz-red);
  padding-bottom: .15em;
  margin-top: 1.5em;
}
/* =========================================================
   Research / publication cards
   ========================================================= */
.pub-list {
  margin-top: .6em;
}
.pub-item {
  text-align: justify;
  padding: .85em 1.1em;
  margin-bottom: .9em;
  border: 1px solid #ececec;
  border-left: 4px solid var(--rbnz-red);
  border-radius: 8px;
  background: var(--card-bg);
  transition: box-shadow .2s ease, transform .2s ease;
}
.pub-item:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,.08);
  transform: translateY(-2px);
}
.pub-title {
  font-size: .98rem;
  font-weight: 600;
  line-height: 1.35;
  margin-bottom: .2em;
  color: var(--rbnz-black);
}
.pub-title a {
  color: var(--rbnz-black);
  text-decoration: none;
}
.pub-title a:hover {
  color: var(--rbnz-red);
  text-decoration: underline;
}
.pub-venue {
  font-size: .8rem;
  font-style: italic;
  color: #666;
  margin-bottom: .3em;
}
.pub-authors {
  font-size: .85rem;
  color: #333;
  margin-bottom: .35em;
}
.pub-authors strong {
  color: var(--rbnz-red);
}
.pub-desc {
  font-size: .84rem;
  color: #555;
  margin: .3em 0 .55em;
  line-height: 1.6;
}
.pub-pdf {
  display: inline-block;
  font-size: .74rem;
  font-weight: 600;
  padding: .1em .65em;
  border: 1px solid var(--rbnz-red);
  border-radius: 5px;
  color: var(--rbnz-red);
  text-decoration: none;
  margin-right: .25em;
}
.pub-pdf:hover {
  background: var(--rbnz-red);
  color: #fff;
  text-decoration: none;
}
/* =========================================================
   Timeline
   ========================================================= */
.timeline {
  margin-top: .5em;
}
.timeline-item {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  padding: .6em 0;
  border-bottom: 1px solid var(--light-grey);
}
.timeline-item:last-child {
  border-bottom: none;
}
.timeline-year {
  flex: 0 0 140px;
  font-size: .8rem;
  font-weight: 600;
  color: var(--rbnz-black);
  white-space: nowrap;
}
.timeline-year.news {
  color: var(--rbnz-red);
}
.timeline-body {
  flex: 1 1 320px;
  font-size: .9rem;
  line-height: 1.55;
  color: #333;
  text-align: justify;
}
.timeline-body strong {
  color: #000;
}
.timeline-body a {
  color: var(--rbnz-red);
  text-decoration: none;
}
.timeline-body a:hover {
  color: var(--rbnz-red-dark);
  text-decoration: underline;
}
/* =========================================================
   Mobile
   ========================================================= */
@media (max-width: 700px) {
  .profile-pic {
    float: none;
    display: block;
    width: 180px;
    max-width: 60%;
    margin: 0 0 1em 0;
  }
  .profile-name {
    font-size: 1.55rem;
  }
  .timeline-year {
    flex: 0 0 100%;
  }
  .about-text {
    text-align: left;
  }
  .timeline-body {
    text-align: left;
  }
  .pub-item {
    text-align: left;
  }
}
</style>

<div class="profile-header">
<img class="profile-pic" src="/images/IMG_5869.jpeg" alt="Zhiruo Zhang" />
<div class="profile-name">
Zhiruo (Rachel) Zhang 张芷若
</div>
<div class="profile-role">
Senior Analyst · Modelling Team · Reserve Bank of New Zealand
</div>
<div class="profile-degree">
Ph.D. in Economics and Econometrics · Adelaide University
</div>
<div class="about-text" markdown="1">

I am a Senior Analyst in the Modelling Team at the Reserve Bank of New Zealand.

I received my Ph.D. in Economics and Econometrics from Adelaide University in September 2026, under the supervision of Prof. Firmin Doko Tchatoka and A/Prof. Qazi Haque.

My research lies at the intersection of macroeconometrics and Bayesian econometrics, with a particular focus on developing econometric methods for macroeconomic and financial applications.

I also serve as Secretary of the Local Organizing Committee for the 2026 Econometric Society Australasia Meeting (ESAM).

</div>
<div class="research-interests">
<strong>Research Interests:</strong>
Bayesian Econometrics ·
Time-Series Econometrics ·
Panel Data Econometrics ·
Macroeconomic &amp; Financial Forecasting ·
Machine Learning ·
High-Dimensional Econometrics
</div>
<div class="social-row">
<a class="social-chip" href="mailto:zhiruo.zhang@adelaide.edu.au">✉ Email</a>
<a class="social-chip" href="https://www.linkedin.com/in/zhiruo-zhang-016b86179/" target="_blank" rel="noopener noreferrer">in LinkedIn</a>
<a class="social-chip orcid" href="https://orcid.org/0000-0002-4887-3068" target="_blank" rel="noopener noreferrer">🆔 ORCID</a>
<a class="social-chip" href="https://github.com/zhiruozzr" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
<a class="cv-button" href="/files/CV.pdf" target="_blank" rel="noopener noreferrer">📄 CV</a>
</div>
</div>

# 📰 News

<div class="timeline">
<div class="timeline-item">
  <div class="timeline-year news">
    Sep 2026
  </div>
  <div class="timeline-body">
    Joined the <strong>Reserve Bank of New Zealand</strong> as a
    <strong>Senior Analyst in the Modelling Team</strong>.
  </div>
</div>
<div class="timeline-item">
  <div class="timeline-year news">
    Sep 2026
  </div>
  <div class="timeline-body">
    Received my <strong>Ph.D. in Economics and Econometrics</strong>
    from Adelaide University.
  </div>
</div>
<div class="timeline-item">
  <div class="timeline-year news">
    Nov 2026
  </div>
  <div class="timeline-body">
    Presenting at the
    <a
      href="https://adelaide.edu.au/about/events/2026/2026-econometric-society-australasia-meeting-esam/"
      target="_blank"
      rel="noopener noreferrer">
      <strong>2026 Econometric Society Australasia Meeting (ESAM)</strong>
    </a>,
    Adelaide University.
  </div>
</div>
</div>

# 📝 Research

<div class="pub-list">
<div class="pub-item">
  <div class="pub-title">
    Adaptive Bayesian Shrinkage of High-Dimensional Panel VARs
  </div>
  <div class="pub-authors">
    <strong>Zhiruo Zhang</strong>,
    Firmin Doko Tchatoka,
    &amp; Qazi Haque
  </div>
  <div class="pub-desc">
    This paper develops a Bayesian framework for estimating high-dimensional
    panel vector autoregressions using adaptive shrinkage and variable selection.
    The approach accommodates cross-sectional interdependence and unit-specific
    heterogeneity, performs well in Monte Carlo experiments, and delivers stable
    forecasts and economically interpretable evidence on financial contagion in
    euro-area sovereign bond markets.
  </div>
  <a class="pub-pdf" href="/files/paper.pdf" target="_blank" rel="noopener noreferrer">Paper</a>
  <a class="pub-pdf" href="/files/slides.pdf" target="_blank" rel="noopener noreferrer">Slides</a>
</div>
<div class="pub-item">
  <div class="pub-title">
    Bayesian Network Estimation for High-Dimensional Panel VARs
  </div>
  <div class="pub-authors">
    <strong>Zhiruo Zhang</strong>,
    Firmin Doko Tchatoka,
    &amp; Qazi Haque
  </div>
  <div class="pub-desc">
    This project develops a Bayesian Graphical Network Lasso for sparse
    precision-matrix estimation in high-dimensional PVARX models.
    The framework identifies contemporaneous conditional dependencies
    in an order-invariant way and is applied to international transmission
    of natural-disaster shocks across high-income economies.
  </div>
</div>
<div class="pub-item">
  <div class="pub-title">
    Disentangling Spillover Networks and Transmission Channels in Panel VARs
  </div>
  <div class="pub-authors">
    <strong>Zhiruo Zhang</strong>
  </div>
  <div class="pub-desc">
    This paper proposes a bi-level spike-and-slab framework that selects both
    bilateral country-pair spillovers and the variables operating within active
    links. An EM-based algorithm makes the non-convex model practical in high
    dimensions and reveals a sparse, structured global macroeconomic network
    with interpretable transmission channels.
  </div>
</div>
</div>

# 🔬 Work in Progress

<div class="pub-list">
<div class="pub-item">
  <div class="pub-title">
    Structural Transformation, Green Technology, and Labor Reallocation
  </div>
  <div class="pub-authors">
    <strong>Zhiruo Zhang</strong>
    &amp;
    <a
      href="https://researchers.adelaide.edu.au/profile/xiyu.ni"
      target="_blank"
      rel="noopener noreferrer">
      Xiyu Ni
    </a>
  </div>
</div>
</div>

# 📬 Contact

<div class="timeline">
<div class="timeline-item">
  <div class="timeline-year">
    Email
  </div>
  <div class="timeline-body">
<a href="mailto:Rachel.Zhang2@rbnz.govt.nz">
  Rachel.Zhang2@rbnz.govt.nz
</a>
&nbsp;·&nbsp;
<a href="mailto:zhiruo.zhang@adelaide.edu.au">
  zhiruo.zhang@adelaide.edu.au
</a>
  </div>
</div>
<div class="timeline-item">
  <div class="timeline-year">
    Profiles
  </div>
  <div class="timeline-body">
<a
  href="https://www.linkedin.com/in/zhiruo-zhang-016b86179/"
  target="_blank"
  rel="noopener noreferrer">
  LinkedIn
</a>
&nbsp;·&nbsp;
<a
  href="https://orcid.org/0000-0002-4887-3068"
  target="_blank"
  rel="noopener noreferrer">
  ORCID
</a>
&nbsp;·&nbsp;
<a
  href="https://github.com/zhiruozzr"
  target="_blank"
  rel="noopener noreferrer">
  GitHub
</a>
  </div>
</div>
<div class="timeline-item">
  <div class="timeline-year">
    Personal
  </div>
  <div class="timeline-body">
    <a
      href="https://jaydenhyj.github.io/"
      target="_blank"
      rel="noopener noreferrer">
      Dr. Yaojia Han
    </a>
  </div>
</div>
</div>
