---
title: BibViz Project - Bible Contradictions, Misogyny, Violence, Inaccuracies
description: A beautiful and interactive resource to explore negative aspects of the Bible.
image: /square.png
template: layout.html
styles:
- /styles/poster.css
scripts:
- http://d3js.org/d3.v3.min.js
- /scripts/main.js
---

<h1 style="margin-top: -40px;">{% trans %}The Holy Bible{% endtrans %}</h1>

<h2><i class="icon-sitemap"></i> {% trans %}Contradictions{% endtrans %} <a id="contradictions" href="#contradictions"><i class="icon-link"></i></a></h2>
<svg id="contradictions-chart" width="1200" height="500"></svg>
<h2><i class="icon-beaker"></i> {% trans %}Scientific Absurdities &amp; Historical Inaccuracies{% endtrans %}<a id="science" href="#science"><i class="icon-link"></i></a></h2>
<svg id="science-chart" width="1200" height="100"></svg>
<blockquote class="science">{% trans %}And there appeared another wonder in heaven; and behold a great red dragon, having seven heads and ten horns, and seven crowns upon his heads.{% endtrans %}<br/><br/><div><a href="http://www.biblegateway.com/passage/?search=Revelation%2012:3&amp;version=KJV">{% trans %}Revelation 12:3{% endtrans %}</a></div></blockquote>
<blockquote class="science">{% trans %}And Methuselah lived after he begat Lamech seven hundred eighty and two years, and begat sons and daughters: And all the days of Methuselah were nine hundred sixty and nine years: and he died.{% endtrans %}<div><a href="http://www.biblegateway.com/passage/?search=Genesis%205:26-27&amp;version=KJV">{% trans %}Genesis 5:26-27{% endtrans %}</a></div></blockquote>
<div class="clear"></div>
<h2><i class="icon-rocket"></i> {% trans %}Cruelty &amp; Violence{% endtrans %} <a id="violence" href="#violence"><i class="icon-link"></i></a></h2>
<svg id="violence-chart" width="1200" height="100"></svg>
<blockquote class="violence">{% trans %}And everyone who would not seek the Lord, the God of Israel, was to be put to death, whether small or great, whether man or woman.{% endtrans %}<div><a href="http://www.biblegateway.com/passage/?search=2%20Chronicles%2015:13&amp;version=KJV">{% trans %}2 Chronicles 15:13{% endtrans %}</a></div></blockquote>
<blockquote class="violence">{% trans %}Six days may work be done; but in the seventh is the sabbath of rest, holy to the Lord whosoever doeth any work in the sabbath day, he shall surely be put to death.{% endtrans %}<div><a href="http://www.biblegateway.com/passage/?search=Exodus%2031:15&amp;version=KJV">{% trans %}Exodus 31:15{% endtrans %}</a></div></blockquote>
<div class="clear"></div>
<h2><i class="icon-female"></i> {% trans %}Misogyny, Violence &amp; Discrimination Against Women{% endtrans %} <a id="misogyny" href="#misogyny"><i class="icon-link"></i></a></h2>
<svg id="misogyny-chart" width="1200" height="100"></svg>
<blockquote class="misogyny">{% trans %}And the daughter of any priest, if she profane herself by playing the whore, she profaneth her father: she shall be burnt with fire.{% endtrans %}<div><a href="http://www.biblegateway.com/passage/?search=Leviticus%2021:9&amp;version=KJV">{% trans %}Leviticus 21:9{% endtrans %}</a></div></blockquote>
<blockquote class="misogyny">{% trans %}But if this thing be true, and the tokens of virginity be not found for the damsel. Then... the men of her city shall stone her with stones that she die.{% endtrans %}<div><a href="http://www.biblegateway.com/passage/?search=Deuteronomy%2022:20-21&amp;version=KJV">{% trans %}Deuteronomy 22:20-21{% endtrans %}</a></div></blockquote>
<div class="clear"></div>
<h2><i class="icon-heart"></i> {% trans %}Discrimination Against Homosexuals{% endtrans %} <a id="homosexual" href="#homosexual"><i class="icon-link"></i></a></h2>
<svg id="homosexual-chart" width="1200" height="100"></svg>
<blockquote class="homosexual">{% trans %}If a man also lie with mankind, as he lieth with a woman, both of them have committed an abomination: they shall surely be put to death; their blood shall be upon them.{% endtrans %}<br/><br/><div><a href="http://www.biblegateway.com/passage/?search=Leviticus%2020:13&amp;version=KJV">{% trans %}Leviticus 20:13{% endtrans %}</a></div></blockquote>
<blockquote class="homosexual">{% trans %}Men, leaving the natural use of the woman, burned in their lust one toward another; men with men working that which is unseemly, and receiving in themselves that recompence of their error which was meet.{% endtrans %}<div><a href="http://www.biblegateway.com/passage/?search=Romans%201:27&amp;version=KJV">{% trans %}Romans 1:27{% endtrans %}</a></div></blockquote>
<div class="clear"></div>
<h2><i class="icon-tasks"></i> {% trans %}Interesting Poll Data{% endtrans %} <a id="polls" href="#polls"><i class="icon-link"></i></a></h2>
<svg id="pCreation" width="200" height="200" style="float: left"></svg>
<svg id="pCreationCollege" width="200" height="200" style="float: right;"></svg>
<blockquote class="poll">{% trans %}Forty-six percent of Americans believe in the creationist view that God created humans in their present form at one time within the last 10,000 years.{% endtrans %}<div><a href="http://www.gallup.com/poll/155003/hold-creationist-view-human-origins.aspx">{% trans %}Gallup (2012){% endtrans %}</a></div></blockquote>
<blockquote class="poll" style="float: right;">{% trans %}Americans with postgraduate education are... least likely to say God created humans in their present form within the last 10,000 years.{% endtrans %}<div><a href="http://www.gallup.com/poll/155003/hold-creationist-view-human-origins.aspx">{% trans %}Gallup (2012){% endtrans %}</a></div></blockquote>
<div class="clear" style="height: 48px;"></div>
<svg id="pChristian" width="200" height="200" style="float: left"></svg>
<svg id="pReligious" width="200" height="200" style="float: right;"></svg>
<blockquote class="poll">{% trans %}The large majority of Americans -- 77% of the adult population -- identify with a Christian religion... Mormons are by far the most religious of any group.{% endtrans %}<div><a href="http://www.gallup.com/poll/159548/identify-christian.aspx">{% trans %}Gallup (2012){% endtrans %}</a></div></blockquote>
<blockquote class="poll" style="float: right;">{% trans %}Sixty-nine percent of American adults are very or moderately religious, based on self-reports of the importance of religion in their daily lives and attendance at religious services.{% endtrans %}<div><a href="http://www.gallup.com/poll/159050/seven-americans-moderately-religious.aspx">{% trans %}Gallup (2012){% endtrans %}</a></div></blockquote>
<div class="clear"></div>
<div style="text-align: center; margin-top: 5em; opacity: 0.6; font-size: 70%;">
    www.BibViz.com
</div>
