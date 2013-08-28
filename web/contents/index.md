---
title: BibViz Project - Bible Contradictions, Misogyny, Violence, Inaccuracies
description: A beautiful and interactive resource to explore negative aspects of the Bible.
image: /square.png
template: layout.jade
scripts:
- http://d3js.org/d3.v3.min.js
- /scripts/main.js
---

<h1 style="margin-top: -40px;">The Holy Bible</h1>

<h2><i class="icon-sitemap"></i> Contradictions <a id="contradictions" href="#contradictions"><i class="icon-link"></i></a></h2>
<div class="filters">
    <div>
        <label for="book-select">Book:</label>
        <select id="book-select">
            <option>All</option>
        </select>
    </div>
    <div>
        <label for="type-select">Type:</label>
        <select id="type-select">
            <option>All</option>
        </select>
    </div>
    <div>
        <label for="color-select">Colors:</label>
        <select id="color-select">
            <option>Crimson</option>
            <option>Rainbow</option>
        </select>
    </div>
    <div>
        <a href="#contradictionList" style="color: white; text-decoration: none;">See full list <i class="icon-download"></i></a>
    </div>
</div>
<svg id="contradictions-chart" width="1200" height="500"></svg>
<div id="social">
    <div class="fb-like" data-href="http://www.bibviz.com/" data-width="300" data-layout="button_count" data-show-faces="true" data-send="false"></div>
    <span class="spacer"></span>
    <div class="g-plusone" data-size="medium"></div>
    <span class="spacer"></span>
    <a href="https://twitter.com/share" class="twitter-share-button" data-text="Bible Interactively Visualized: Contradictions, Misogyny, Violence, Inaccuracies http://bibviz.com/" data-via="dgt84" data-hashtags="bibviz,bible">Tweet</a>
</div>
<h2><i class="icon-beaker"></i> Scientific Absurdities &amp; Historical Inaccuracies<a id="science" href="#science"><i class="icon-link"></i></a></h2>
<svg id="science-chart" width="1200" height="100"></svg>
<blockquote class="science">And there appeared another wonder in heaven; and behold a great red dragon, having seven heads and ten horns, and seven crowns upon his heads.<br/><br/><div><a href="http://www.biblegateway.com/passage/?search=Revelation%2012:3&amp;version=KJV">Revelation 12:3</a></div></blockquote>
<blockquote class="science">And Methuselah lived after he begat Lamech seven hundred eighty and two years, and begat sons and daughters: And all the days of Methuselah were nine hundred sixty and nine years: and he died.<div><a href="http://www.biblegateway.com/passage/?search=Genesis%205:26-27&amp;version=KJV">Genesis 5:26-27</a></div></blockquote>
<div class="clear"></div>
<h2><i class="icon-rocket"></i> Cruelty &amp; Violence <a id="violence" href="#violence"><i class="icon-link"></i></a></h2>
<svg id="violence-chart" width="1200" height="100"></svg>
<blockquote class="violence">And everyone who would not seek the Lord, the God of Israel, was to be put to death, whether small or great, whether man or woman.<div><a href="http://www.biblegateway.com/passage/?search=2%20Chronicles%2015:13&amp;version=KJV">2 Chronicles 15:13</a></div></blockquote>
<blockquote class="violence">Six days may work be done; but in the seventh is the sabbath of rest, holy to the Lord whosoever doeth any work in the sabbath day, he shall surely be put to death.<div><a href="http://www.biblegateway.com/passage/?search=Exodus%2031:15&amp;version=KJV">Exodus 31:15</a></div></blockquote>
<div class="clear"></div>
<h2><i class="icon-female"></i> Misogyny, Violence &amp; Discrimination Against Women <a id="misogyny" href="#misogyny"><i class="icon-link"></i></a></h2>
<svg id="misogyny-chart" width="1200" height="100"></svg>
<blockquote class="misogyny"> And the daughter of any priest, if she profane herself by playing the whore, she profaneth her father: she shall be burnt with fire.<div><a href="http://www.biblegateway.com/passage/?search=Leviticus%2021:9&amp;version=KJV">Leviticus 21:9</a></div></blockquote>
<blockquote class="misogyny">But if this thing be true, and the tokens of virginity be not found for the damsel. Then... the men of her city shall stone her with stones that she die.<div><a href="http://www.biblegateway.com/passage/?search=Deuteronomy%2022:20-21&amp;version=KJV">Deuteronomy 22:20-21</a></div></blockquote>
<div class="clear"></div>
<h2><i class="icon-heart"></i> Discrimination Against Homosexuals <a id="homosexual" href="#homosexual"><i class="icon-link"></i></a></h2>
<svg id="homosexual-chart" width="1200" height="100"></svg>
<blockquote class="homosexual">If a man also lie with mankind, as he lieth with a woman, both of them have committed an abomination: they shall surely be put to death; their blood shall be upon them.<br/><br/><div><a href="http://www.biblegateway.com/passage/?search=Leviticus%2020:13&amp;version=KJV">Leviticus 20:13</a></div></blockquote>
<blockquote class="homosexual">Men, leaving the natural use of the woman, burned in their lust one toward another; men with men working that which is unseemly, and receiving in themselves that recompence of their error which was meet.<div><a href="http://www.biblegateway.com/passage/?search=Romans%201:27&amp;version=KJV">Romans 1:27</a></div></blockquote>
<div class="clear"></div>
<h2><i class="icon-tasks"></i> Interesting Poll Data <a id="polls" href="#polls"><i class="icon-link"></i></a></h2>
<svg id="pCreation" width="200" height="200" style="float: left"></svg>
<svg id="pCreationCollege" width="200" height="200" style="float: right;"></svg>
<blockquote class="poll">Forty-six percent of Americans believe in the creationist view that God created humans in their present form at one time within the last 10,000 years.<div><a href="http://www.gallup.com/poll/155003/hold-creationist-view-human-origins.aspx">Gallup (2012)</a></div></blockquote>
<blockquote class="poll" style="float: right;">Americans with postgraduate education are... least likely to say God created humans in their present form within the last 10,000 years.<div><a href="http://www.gallup.com/poll/155003/hold-creationist-view-human-origins.aspx">Gallup (2012)</a></div></blockquote>
<div class="clear" style="height: 48px;"></div>
<svg id="pChristian" width="200" height="200" style="float: left"></svg>
<svg id="pReligious" width="200" height="200" style="float: right;"></svg>
<blockquote class="poll">The large majority of Americans -- 77% of the adult population -- identify with a Christian religion... Mormons are by far the most religious of any group.<div><a href="http://www.gallup.com/poll/159548/identify-christian.aspx">Gallup (2012)</a></div></blockquote>
<blockquote class="poll" style="float: right;">Sixty-nine percent of American adults are very or moderately religious, based on self-reports of the importance of religion in their daily lives and attendance at religious services.<div><a href="http://www.gallup.com/poll/159050/seven-americans-moderately-religious.aspx">Gallup (2012)</a></div></blockquote>
<div class="clear"></div>
<h3>Interesting Reading Material <a id="readingMaterial" href="#readingMaterial"><i class="icon-link"></i></a></h3>
<div class="books">
    <a href="http://www.amazon.com/gp/product/0988245108/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=0988245108&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0988245108&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=0988245108" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    <a href="http://www.amazon.com/gp/product/0988245116/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=0988245116&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0988245116&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=0988245116" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    <a href="http://www.amazon.com/gp/product/1416594795/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=1416594795&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1416594795&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=1416594795" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    <a href="http://www.amazon.com/gp/product/0618918248/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=0618918248&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0618918248&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=0618918248" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    <a href="http://www.amazon.com/gp/product/0446697966/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=0446697966&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0446697966&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=0446697966" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    <a href="http://www.amazon.com/gp/product/0307278778/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=0307278778&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0307278778&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=0307278778" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    <a href="http://www.amazon.com/gp/product/0143038338/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=0143038338&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0143038338&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=0143038338" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    <a href="http://www.amazon.com/gp/product/1569755671/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=1569755671&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1569755671&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=1569755671" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
    <a href="http://www.amazon.com/gp/product/1569756775/ref=as_li_tf_il?ie=UTF8&camp=1789&creative=9325&creativeASIN=1569756775&linkCode=as2&tag=bibvicom-20"><img border="0" src="http://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1569756775&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=bibvicom-20" ></a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=bibvicom-20&l=as2&o=1&a=1569756775" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
</div>
<h3>List of Contradictions Depicted Above (Click for more info) <a id="contradictionList" href="#contradictionList"><i class="icon-link"></i></a></h3>
<table id="contradictionsTable"></table>
<div class="footer">
    <div>
        <p>
            This website aspires to be a beautiful and interactive resource for skeptics and believers alike to explore some of the more negative aspects of holy books.<br/>It was heavily inspired by the <a href="http://www.project-reason.org/gallery3/image/105/">Reason Project's poster of biblical contradictions</a>, which in turn was inspired by <a href="http://www.chrisharrison.net/index.php/Visualizations/BibleViz">Chris Harrison's Bible Visualizations</a>.
        </p>
        <p>
            Many of the contradictions above stem from a literal interpretation of the stories in the Bible. Some verses may be mistranslations, allegories, exaggerations, etc and can be interpreted in the context of the society in which they were written, rewritten, or otherwise modified over time. Considering that 46% of Americans believe in a literal interpretation of Genesis (and probably other portions of the Bible) and the fact that many sects disagree on which parts to take literally, it seems reasonable to include these contradictions based on literal interpretation.
        </p>
        <p>
            This website and domain cost money, so please <a href="https://spb.io/0rgLYyRkJK">consider making a donation</a>. Your donations keep this website running for everyone to enjoy, and prevent annoying non-relevant ads.
        </p>
        <div>
            <div id="google_translate_element"></div>
        </div>
    </div>
    <div>
        <div class="block">
            Data for the charts were collected from copyrighted material by the <a href="http://www.skepticsannotatedbible.com">Skeptic's Annotated Bible</a>.
        </div>
        <div class="block">
            This website is free and open source. <a href="https://github.com/danielgtaylor/bibviz">View and contribute to the project</a> on <i class="icon-github-alt"></i> Github!
        </div>
        <div class="block">
            Quotes taken from the Authorized King James Version from 1769, which is a public domain work.
        </div>
        <div class="block">
            Please consider a donation to <a href="http://secular.org/civicrm/contribute/transact">The Secular Coalition for America</a>, <a href="http://www.amnesty.org/en/donate">Amnesty International</a>, <a href="https://www.doctorswithoutborders.org/donate/onetime.cfm">Doctors Without Borders</a>, or <a href="http://www.supportunicef.org/">UNICEF</a>.
        </div>
        <div class="clear"></div>
    </div>
</div>
<div id="selected">Hover over a line or bar to show more info about a contradiction, chapter or book.<br/></div>
<div id="filter-notice">
    <i class="icon-hand-left"></i> Check out these filters to modify the chart!
</div>
<div id="contra-notice">
    <i class="icon-hand-down"></i> Click a line for more info!
</div>
