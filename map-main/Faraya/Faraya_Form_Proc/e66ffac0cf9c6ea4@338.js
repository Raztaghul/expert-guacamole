export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["PROC_FORM_3.json",new URL("./files/8403ad515dd34030fa1935b6cce1693bc8943daa3cd6fa20d48be52c7ead83b193600e1a628558572f9c4a7e01abab4d3cc228d9fe89bd4e489144448b95a695",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Bilevel Edge Bundling

This variation of [hierarchical edge bundling](/@d3/hierarchical-edge-bundling) constructs a simple two-level hierarchy using numbered groups. See this same dataset as a [force-directed graph](/@d3/d3-force-directed-graph).`
)});
  main.variable(observer("chart")).define("chart", ["tree","bilink","d3","data","width","colornone","line","colorin","colorout"], function(tree,bilink,d3,data,width,colornone,line,colorin,colorout)
{
  //craete a hierchical tree based one the data of "data" by ordering them based on height or id  
  // bilink is a function(at the bottom of code ) 
  const root = tree(bilink(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.id, b.data.id))));
//reate the main svg 
  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -width / 2, width, width]);

  const node = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
    .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.id)
  //for eadh node, 
      .each(function(d) { d.text = this; })
  //overed is the behaviour when we have a mouseover on one of the elements(nodes)
      .on("mouseover", overed)
  
      .on("mouseout", outed)
      .call(text => text.append("title").text(d => `${d.data.id} ${d.outgoing.length} outgoing ${d.incoming.length} incoming`));

  //link drawing 
  const link = svg.append("g")
      .attr("stroke", colornone)
      .attr("fill", "none")
    .selectAll("path")
    .data(root.leaves().flatMap(leaf => leaf.outgoing))
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", ([i, o]) => line(i.path(o)))
      .each(function(d) { d.path = this; });

  
  //change link style based on the event(mouseover mouseouted
  function overed(event, d) {
    link.style("mix-blend-mode", null);
    d3.select(this).attr("font-weight", "bold");
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", colorin).attr("font-weight", "bold");
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", colorout).attr("font-weight", "bold");
  }
//in outed state, made everything reseted 
  function outed(event, d) {
    link.style("mix-blend-mode", "multiply");
    d3.select(this).attr("font-weight", null);
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", null).attr("font-weight", null);
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", null).attr("font-weight", null);
  }

  return svg.node();
}
);
  main.variable(observer("graph")).define("graph", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("PROC_FORM_3.json").json()
)});
  main.variable(observer("data")).define("data", ["graph"], function(graph)
{
  const {nodes, links} = graph;
  const groupById = new Map;
  const nodeById = new Map(nodes.map(node => [node.id, node]));

  for (const node of nodes) {
    let group = groupById.get(node.group);
    if (!group) groupById.set(node.group, group = {id: node.group, children: []});
    group.children.push(node);
    node.targets = [];
  }

  for (const {source: sourceId, target: targetId} of links) {
    nodeById.get(sourceId).targets.push(targetId);
  }

  return {children: [...groupById.values()]};
}
);
  main.variable(observer("bilink")).define("bilink", function(){return(
function bilink(root) {
  const map = new Map(root.leaves().map(d => [d.data.id, d]));
  for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.targets.map(i => [d, map.get(i)]);
  for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
  return root;
}
)});
  main.variable(observer("colorin")).define("colorin", function(){return(
"#00f"
)});
  main.variable(observer("colorout")).define("colorout", function(){return(
"#f00"
)});
  main.variable(observer("colornone")).define("colornone", function(){return(
"#ccc"
)});
  main.variable(observer("width")).define("width", function(){return(
954
)});
  main.variable(observer("radius")).define("radius", ["width"], function(width){return(
width / 2
)});
  main.variable(observer("line")).define("line", ["d3"], function(d3){return(
d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius(d => d.y)
    .angle(d => d.x)
)});
  main.variable(observer("tree")).define("tree", ["d3","radius"], function(d3,radius){return(
d3.cluster()
    .size([2 * Math.PI, radius - 100])
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  return main;
}
