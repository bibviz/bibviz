---
title: BibViz Project - Bible Contradictions, Misogyny, Violence, Inaccuracies
description: A beautiful and interactive resource to explore negative aspects of the Bible.
image: /square.png
template: layout.html
styles:
- /styles/poster.css
- /styles/poster2.css
scripts:
- http://d3js.org/d3.v3.min.js
- /scripts/main.js
---

<h1 style="margin-top: -40px;">{% trans %}The Holy Bible{% endtrans %}</h1>

<h2><i class="icon-sitemap"></i> {% trans %}Contradictions{% endtrans %} <a id="contradictions" href="#contradictions"><i class="icon-link"></i></a></h2>
<svg id="contradictions-chart" width="1200" height="500"></svg>
<h3>{% trans %}List of Contradictions Depicted Above{% endtrans %} <a id="contradictionList" href="#contradictionList"><i class="icon-link"></i></a></h3>
<table id="contradictionsTable">
<tr>
{# Render these here for better SEO instead of dynamically at page load #}
{% for contra in env.getContra() -%}
{% if loop.index0 != 0 and loop.index0 % 4 == 0 -%}
</tr><tr>
{%- endif %}
<td><a href="http://www.skepticsannotatedbible.com/contra/{{ contra.url }}">{{ loop.index }} {{ _(contra.desc.trim()) }}</a></td>
{%- endfor %}
</tr>
</table>
<div class="clear"></div>
<div style="text-align: center; margin-top: 5em; opacity: 0.6; font-size: 70%;">
    www.BibViz.com
</div>
