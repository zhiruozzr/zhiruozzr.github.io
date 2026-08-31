---
permalink: /
title: ""
layout: single
author_profile: false
sitemap: true
---

<style>
/* ===== RBNZ-inspired palette: black + rich red =====
   Based on the Reserve Bank of New Zealand — Te Pūtea Matua
   visual identity. Kept intentionally restrained for a personal site. */
:root {
  --rbnz-black: #111111;
  --rbnz-charcoal: #2D2D2D;
  --rbnz-red: #D50057;
  --rbnz-red-dark: #A90045;
  --rbnz-muted: #6B6B6B;
  --rbnz-line: #E7E7E7;
  --rbnz-soft: #FAFAFA;
  --rbnz-blush: #FFF4F8;
}

/* ===== al-folio-style profile header ===== */
.profile-header {
  margin: .3em 0 1.5em;
}

.profile-header::after {
  content: "";
  display: block;
  clear: both;
}

.profile-pic {
  float: right;
  width: 215px;
  max-width: 39%;
  border-radius: 10px;
  margin: .2em 0 1em 1.7em;
  box-shadow: 0 4px 18px rgba(0, 0, 0, .12);
}

.profile-name {
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--rbnz-black);
  line-height: 1.2;
  margin: 0 0 .12em;
}

.profile-cn {
  font-size: .92rem;
  font-weight: 500;
  color: var(--rbnz-muted);
  margin-left: .25em;
}

.profile-role {
  font-size: 1rem;
  font-weight: 600;
  color: var(--rbnz-black);
  margin-bottom: .5em;
}

.profile-next {
  font-size: .86rem;
  font-weight: 650;
  color: var(--rbnz-red);
  margin-bottom: .9em;
}

.about-text {
  text-align: justify;
  font-size: .95rem;
  line-height: 1.66;
}

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
}

.social-chip:hover {
  border-color: var(--rbnz-red);
  background: var(--rbnz-red);
  color: #fff;
}

.social-chip.orcid {
  border-color: #A6CE39;
  color: #5E7D11;
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
}

.cv-button:hover {
  background: var(--rbnz-red);
  color: #fff;
}

/* ===== section headings ===== */
.page__content h1 {
  border-bottom: 2px solid var(--rbnz-red);
  padding-bottom: .15em;
  margin-top: 2em;
}

/* ===== research cards ===== */
.pub-list {
  margin-top: .6em;
}

.pub-item {
  text-align: justify;
  padding: .9em 1.1em;
  margin-bottom: .9em;
  border: 1px solid var(--rbnz-line);
  border-left: 4px solid var(--rbnz-red);
  border-radius: 8px;
  background: var(--rbnz-soft);
  transition: box-shadow .2s ease, transform .2s ease;
}

.pub-item:hover {
  background: var(--rbnz-blush);
  box-shadow: 0 4px 14px rgba(0, 0, 0, .07);
  transform: translateY(-2px);
}

.pub-title {
  font-size: .98rem;
  font-weight: 650;
  line-height: 1.4;
  margin-bottom: .2em;
  color: var(--rbnz-black);
}

.pub-title a {
  color: var(--rbnz-black);
  text-decoration: none;
}

.pub-title a:hover {
  text-decoration: underline;
}

.pub-authors {
  font-size: .85rem;
  color: #394149;
  margin-bottom: .35em;
}

.pub-authors strong {
  color: var(--rbnz-red);
}

.pub-desc {
  font-size: .84rem;
  color: #555F67;
  margin: .3em 0 .55em;
  line-height: 1.58;
}

.pub-link {
  display: inline-block;
  font-size: .74rem;
  font-weight: 600;
  padding: .1em .65em;
  margin-right: .3em;
  border: 1px solid var(--rbnz-red);
  border-radius: 5px;
  color: var(--rbnz-red);
  text-decoration: none;
}

.pub-link:hover {
  background: var(--rbnz-red);
  color: #fff;
}

/* ===== timeline rows ===== */
.timeline {
  margin-top: .5em;
}

.timeline-item {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  padding: .6em 0;
  border-bottom: 1px solid #F0F2F3;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-year {
  flex: 0 0 140px;
  font-size: .8rem;
  font-weight: 600;
  color: var(--rbnz-charcoal);
  white-space: nowrap;
}

.timeline-year.news {
  color: var(--rbnz-red);
}

.timeline-body {
  flex: 1 1 320px;
  font-size: .9rem;
  line-height: 1.55;
  color: #343B41;
  text-align: justify;
}

.timeline-body strong {
  color: #111;
}

@media (max-width: 700px) {
  .profile-pic {
    float: none;
    display: block;
    width: 175px;
    max-width: 58%;
    margin: 0 0 1.2em;
  }

  .profile-name {
    font-size: 1.65rem;
  }

  .about-text,
  .pub-item,
  .timeline-body {
    text-align: left;
  }
}
</style>

<span class='anchor' id='about-me'></span>

<div class="profile-header">

<img class="profile-pic" src="/images/IMG_5869.jpeg" alt="Zhiruo Zhang" />

<div class="profile-name">Zhiruo (Rachel) Zhang <span class="profile-cn">张芷若</span></div>
<div class="profile-role">Ph.D. in Economics and Econometrics · University of Adelaide</div>
<div class="profile-next">Joining the Reserve Bank of New Zealand · 21 September 2026</div>

<div class="about-text" markdown="1">

I received my **Ph.D. in Economics and Econometrics** from the **University of Adelaide** in August 2026, supervised by [Prof. Firmin Doko Tchatoka](https://sites.google.com/view/firmindokotchatoka/home) and [A/Prof. Qazi Haque](https://sites.google.com/site/qazigmziaulhaque/).

I am a **macroeconometrician** working in Bayesian econometrics, time-series econometrics, and panel data econometrics. My research focuses on macroeconomic and financial forecasting, Bayesian learning, machine learning methods, and high-dimensional economic data.

</div>

<div class="social-row">
<a class="social-chip" href="mailto:zhiruo.zhang@adelaide.edu.au">✉ Email</a>
<a class="social-chip" href="https://www.linkedin.com/in/zhiruo-zhang-016b86179/" target="_blank">in LinkedIn</a>
<a class="social-chip orcid" href="https://orcid.org/0000-0002-4887-3068" target="_blank">ORCID</a>
<a class="social-chip" href="https://github.com/zhiruozzr" target="_blank">⌘ GitHub</a>
<a class="cv-button" href="/files/CV_JM.pdf" target="_blank">CV</a>
</div>

</div>

# News

<div class="timeline">
<div class="timeline-item">
  <div class="timeline-year news">21 Sep 2026</div>
  <div class="timeline-body">Joining the <strong>Reserve Bank of New Zealand</strong>.</div>
</div>

<div class="timeline-item">
  <div class="timeline-year news">24–27 Nov 2026</div>
  <div class="timeline-body">Presenting at the <a href="https://adelaide.edu.au/about/events/2026/2026-econometric-society-australasia-meeting-esam/" target="_blank"><strong>2026 Econometric Society Australasia Meeting (ESAM)</strong></a>, University of Adelaide, City East Campus.</div>
</div>
</div>

<span class='anchor' id='research'></span>

# Research

<div class="pub-list">

<div class="pub-item">
  <div class="pub-title">Adaptive Bayesian Shrinkage of High-Dimensional Panel VARs</div>
  <div class="pub-authors"><strong>Zhiruo Zhang</strong>, Firmin Doko Tchatoka, and Qazi Haque</div>
  <div class="pub-desc">Develops a Bayesian framework for estimating high-dimensional panel vector autoregressions using adaptive shrinkage and variable selection. The approach accommodates cross-sectional interdependence and unit-specific heterogeneity, delivers stable forecasts, and provides economically interpretable evidence on financial contagion in euro-area sovereign bond markets.</div>
  <a class="pub-link" href="/files/Adaptive.pdf" target="_blank">Paper</a>
  <a class="pub-link" href="/files/Adaptive_Slides.pdf" target="_blank">Slides</a>
</div>

<div class="pub-item">
  <div class="pub-title">Bayesian Network Estimation for High-Dimensional Panel VARs</div>
  <div class="pub-authors"><strong>Zhiruo Zhang</strong>, Firmin Doko Tchatoka, and Qazi Haque</div>
  <div class="pub-desc">Develops a Bayesian Graphical Network Lasso for sparse precision-matrix estimation in high-dimensional PVARX models, identifying contemporaneous conditional dependencies in an order-invariant way and studying international transmission of natural-disaster shocks across high-income economies.</div>
</div>

<div class="pub-item">
  <div class="pub-title">Disentangling Spillover Networks and Transmission Channels in Panel VARs</div>
  <div class="pub-authors"><strong>Zhiruo Zhang</strong></div>
  <div class="pub-desc">Proposes a bi-level spike-and-slab framework that selects both bilateral country-pair spillovers and the variables operating within active links, revealing a sparse and interpretable global macroeconomic network.</div>
</div>

</div>

# Work in Progress

<div class="pub-list">

<div class="pub-item">
  <div class="pub-title">Structural Transformation, Green Technology, and Labor Reallocation</div>
  <div class="pub-authors"><strong>Zhiruo Zhang</strong> and <a href="https://researchers.adelaide.edu.au/profile/xiyu.ni" target="_blank">Xiyu Ni</a></div>
</div>

</div>

<span class='anchor' id='contact'></span>

# Contact

<div class="timeline">
<div class="timeline-item">
  <div class="timeline-year">Email</div>
  <div class="timeline-body"><a href="mailto:zhiruo.zhang@adelaide.edu.au">zhiruo.zhang@adelaide.edu.au</a></div>
</div>
<div class="timeline-item">
  <div class="timeline-year">Profiles</div>
  <div class="timeline-body">
    <a href="https://www.linkedin.com/in/zhiruo-zhang-016b86179/" target="_blank">LinkedIn</a> ·
    <a href="https://orcid.org/0000-0002-4887-3068" target="_blank">ORCID</a> ·
    <a href="https://github.com/zhiruozzr" target="_blank">GitHub</a>
  </div>
</div>
</div>
