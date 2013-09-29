---
title: BibViz Project - Bible Contradictions, Misogyny, Violence, Inaccuracies interactively visualized
description: A beautiful and interactive resource to explore Bible contradictions, cruelty and other negative aspects of the Bible
image: /img/square.png
template: index.html
translated: true
scripts:
- http://d3js.org/d3.v3.min.js
- /scripts/main.js?v=6
---

<h1 style="margin-top: -40px;">{% trans %}The Holy Bible{% endtrans %}</h1>

<h2><i class="icon-sitemap"></i> {% trans %}Bible Contradictions{% endtrans %} <a id="contradictions" href="#contradictions"><i class="icon-link"></i></a></h2>
<div class="filters">
    <div>
        <label for="source-select">{% trans %}Source:{% endtrans %}</label>
        <select id="source-select">
            <option value="sab">sab</option>
        </select>
    </div>
    <div>
        <label for="book-select">{% trans %}Book:{% endtrans %}</label>
        <select id="book-select">
            <option value="All">{% trans %}All{% endtrans %}</option>
        </select>
    </div>
    <div>
        <label for="type-select">{% trans %}Type:{% endtrans %}</label>
        <select id="type-select">
            <option value="All">{% trans %}All{% endtrans %}</option>
        </select>
    </div>
    <div>
        <label for="color-select">{% trans %}Colors:{% endtrans %}</label>
        <select id="color-select">
            <option value="Crimson">{% trans %}Crimson{% endtrans %}</option>
            <option value="Rainbow">{% trans %}Rainbow{% endtrans %}</option>
        </select>
    </div>
    <div>
        <input id="text-search" placeholder="Search..." style="width: 120px"/>
    </div>
    <div>
        <a href="#contradictionList" style="color: white; text-decoration: none;">{% trans %}See full list{% endtrans %} <i class="icon-download"></i></a>
    </div>
</div>
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
<h3>{% trans %}BibViz Merchandise{% endtrans %}</h3>
<div>
    <div class="poster">
        <a href="http://www.zazzle.com/bible_contradictions_poster_14_x_24-228921555189929759?rf=238372057425685940" style="float:left"><img height="200" src="/blog/bible-contradictions-poster/bible-contradictions-poster.png"/></a>
        <h4>Bible Contradictions Poster 1</h4>
        <h5>
            14" x 24"
        </h5>
        <p>
            Contradictions, violence, misogyny, homophobia and poll information on a poster.
        </p>
        <p>
            <a class="btn btn-small" href="http://www.zazzle.com/bible_contradictions_poster_14_x_24-228921555189929759?rf=238372057425685940">{% trans %}Buy Now{% endtrans %}</a>
        </p>
    </div>
    <div class="poster">
        <a href="http://www.zazzle.com/bible_contradictions_poster_14_x_22-228252201328757395?rf=238372057425685940" style="float:left"><img height="200" src="/blog/bible-contradictions-poster/bible-contradictions-poster2.png"/></a>
        <h4>Bible Contradictions Poster 2</h4>
        <h5>
            14" x 22"
        </h5>
        <p>
            Over 400 contradictions charted and listed on a poster.
        </p>
        <p>
            <a class="btn btn-small" href="http://www.zazzle.com/bible_contradictions_poster_14_x_22-228252201328757395?rf=238372057425685940">{% trans %}Buy Now{% endtrans %}</a>
        </p>
    </div>
    <div class="clear"></div>
</div>
<h3>{% trans %}Interesting Reading Material{% endtrans %} <a id="readingMaterial" href="#readingMaterial"><i class="icon-link"></i></a></h3>
<div class="books">
    {% import 'amazon.html' as amazon %}
    {{ amazon.books(['0988245108', '0988245116', '1416594795', '0618918248', '0446697966', '0307278778', '0143038338', '1569755671', '1569756775']) }}
</div>
<h3>{% trans %}Interesting Videos{% endtrans %} <a id="videos" href="#videos"><i class="icon-link"></i></a></h3>
<iframe width="580" height="360" src="http://www.youtube.com/embed/PK7P7uZFf5o?feature=player_detailpage" frameborder="0" allowfullscreen style="margin-right: 30px;"></iframe>
<iframe width="580" height="360" src="http://www.youtube.com/embed/RB3g6mXLEKk?feature=player_detailpage" frameborder="0" allowfullscreen></iframe>
<br/><br/>
<iframe width="580" height="360" src="http://www.youtube.com/embed/AcO4TnrskE0?feature=player_detailpage" frameborder="0" allowfullscreen style="margin-right: 30px;"></iframe>
<iframe width="580" height="360" src="http://www.youtube.com/embed/xhhEeI3K7GU?feature=player_detailpage" frameborder="0" allowfullscreen></iframe>
<h3>{% trans %}List of Bible Contradictions Depicted Above (Click for more info){% endtrans %} <a id="contradictionList" href="#contradictionList"><i class="icon-link"></i></a></h3>
{% for name, category in env.getContra() -%}
    <h4>{{ category.desc }} Contradictions</h4>
    <table class="contradictionsTable">
        <tr>
        {# Render these here for better SEO instead of dynamically at page load #}
        {% for contra in category.contradictions -%}
            {% if loop.index0 != 0 and loop.index0 % 4 == 0 -%}
                </tr><tr>
            {%- endif %}
            <td><a href="/{{ env.slug(contra.desc) }}-{{ name }}.html">{{ loop.index }} {{ _(contra.desc.trim()) }}</a></td>
        {%- endfor %}
        </tr>
    </table>
{%- endfor %}
<div class="footer">
    <div>
        <p>
            {% trans %}This website aspires to be a beautiful and interactive resource for skeptics and believers alike to explore some of the more negative aspects of holy books, such as Bible contradictions, biblical inerrancy and the Bible as a source of morality.<br/>It was heavily inspired by the <a href="http://www.project-reason.org/gallery3/image/105/">Reason Project's poster of biblical contradictions</a>, which in turn was inspired by <a href="http://www.chrisharrison.net/index.php/Visualizations/BibleViz">Chris Harrison's Bible Visualizations</a>.{% endtrans %}
        </p>
        <p>
            {% trans %}Many of the contradictions above stem from a literal interpretation of the stories in the Bible (biblical inerrancy). Some verses may be mistranslations, allegories, exaggerations, etc and can be interpreted in the context of the society in which they were written, rewritten, or otherwise modified over time, while others are very clear contradictions. Considering that 46% of Americans believe in a literal interpretation of Genesis (and probably other portions of the Bible) and the fact that many sects disagree on which parts to take literally, it seems reasonable to include these contradictions based on literal interpretation.{% endtrans %}
        </p>
        <p>
            {% trans %}I hope to show that while the Bible may have much to offer us, biblical inerrancy and morality are not what it offers. Without inerrancy it's simple to see that we just do not know which parts are the word or will of God. Basing our morality on vile, disgusting stories from a long-forgotten era of humanity in a part of the world many have never even seen seems silly to me. What the Bible does offer us is an amazing look into humanity, our past, our desires and our fears.{% endtrans %}
        </p>
        <p>
            {% trans %}This website and domain cost money, so please <a href="https://spb.io/0rgLYyRkJK">consider making a donation</a>. Your donations keep this website running for everyone to enjoy, and prevent annoying non-relevant ads.{% endtrans %}
        </p>
        <div>
            <div id="google_translate_element"></div>
        </div>
    </div>
    <div>
        <div class="block">
            {% trans %}Data for the charts were collected from copyrighted material by the <a href="http://www.skepticsannotatedbible.com">Skeptic's Annotated Bible</a>.{% endtrans %}
        </div>
        <div class="block" itemscope itemtype="http://schema.org/Code">
            {% trans %}This website is free and open source. <a href="https://github.com/danielgtaylor/bibviz" itemprop="codeRepository">View and contribute to the project</a> on <i class="icon-github-alt"></i> Github!{% endtrans %}
        </div>
        <div class="block">
            {% trans %}Quotes taken from the Authorized King James Version from 1769, which is a public domain work.{% endtrans %}
        </div>
        <div class="block">
            {% trans %}Please consider a donation to <a href="http://secular.org/civicrm/contribute/transact">The Secular Coalition for America</a>, <a href="http://www.amnesty.org/en/donate">Amnesty International</a>, <a href="https://www.doctorswithoutborders.org/donate/onetime.cfm">Doctors Without Borders</a>, or <a href="http://www.supportunicef.org/">UNICEF</a>.{% endtrans %}
        </div>
        <div class="clear"></div>
    </div>
</div>
<div id="selected">{% trans %}Hover over a line or bar to show more info about a contradiction, chapter or book.{% endtrans %}<br/></div>
<div id="filter-notice">
    <i class="icon-hand-left"></i> {% trans %}Check out these filters to modify the chart!{% endtrans %}
</div>
<div id="contra-notice">
    <i class="icon-hand-down"></i> {% trans %}Click a line for more info!{% endtrans %}
</div>
