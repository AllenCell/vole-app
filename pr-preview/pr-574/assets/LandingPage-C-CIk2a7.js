import{d as e}from"./globals-DYj1Nyjm.js";import{N as t,c as n,n as r,r as i,t as a}from"./LoadModal-BjVE8wJ8.js";import{$ as o,Gt as s,H as c,I as l,Ot as u,Q as d,Xt as f,a as p,ar as m,c as h,d as g,ft as ee,gn as te,i as _,jt as ne,kt as v,lr as y,lt as re,pn as b,r as x,rn as S,s as C,sr as w,t as T,vn as E}from"./main-CufmsdJc.js";var D=e=>{let{componentCls:t}=e;return{[t]:{"&-horizontal":{[`&${t}`]:{"&-sm":{marginBlock:e.marginXS},"&-md":{marginBlock:e.margin}}}}}},O=e=>{let{componentCls:t,sizePaddingEdgeHorizontal:n,colorSplit:r,lineWidth:i,textPaddingInline:a,orientationMargin:o,verticalMarginInline:s}=e,c=`${t}-rail`;return{[t]:{...f(e),borderBlockStart:`${b(i)} solid ${r}`,[c]:{borderBlockStart:`${b(i)} solid ${r}`},"&-vertical":{position:`relative`,top:`-0.06em`,display:`inline-block`,height:`0.9em`,marginInline:s,marginBlock:0,verticalAlign:`middle`,borderTop:0,borderInlineStart:`${b(i)} solid ${r}`},"&-horizontal":{display:`flex`,clear:`both`,width:`100%`,minWidth:`100%`,margin:`${b(e.marginLG)} 0`},[`&-horizontal${t}-with-text`]:{display:`flex`,alignItems:`center`,margin:`${b(e.dividerHorizontalWithTextGutterMargin)} 0`,color:e.colorTextHeading,fontWeight:500,fontSize:e.fontSizeLG,whiteSpace:`nowrap`,textAlign:`center`,borderBlockStart:`0 ${r}`,[`${c}-start, ${c}-end`]:{width:`50%`,borderBlockStartColor:`inherit`,borderBlockEnd:0,content:`''`}},[`&-horizontal${t}-with-text-start`]:{[`${c}-start`]:{width:`calc(${o} * 100%)`},[`${c}-end`]:{width:`calc(100% - ${o} * 100%)`}},[`&-horizontal${t}-with-text-end`]:{[`${c}-start`]:{width:`calc(100% - ${o} * 100%)`},[`${c}-end`]:{width:`calc(${o} * 100%)`}},[`${t}-inner-text`]:{display:`inline-block`,paddingBlock:0,paddingInline:a},"&-dashed":{background:`none`,borderColor:r,borderStyle:`dashed`,borderWidth:`${b(i)} 0 0`,[c]:{borderBlockStart:`${b(i)} dashed ${r}`}},[`&-horizontal${t}-with-text${t}-dashed`]:{[`${c}-start, ${c}-end`]:{borderStyle:`dashed none none`}},[`&-vertical${t}-dashed`]:{borderInlineStartWidth:i,borderInlineEnd:0,borderBlockStart:0,borderBlockEnd:0},"&-dotted":{background:`none`,borderColor:r,borderStyle:`dotted`,borderWidth:`${b(i)} 0 0`,[c]:{borderBlockStart:`${b(i)} dotted ${r}`}},[`&-horizontal${t}-with-text${t}-dotted`]:{"&::before, &::after":{borderStyle:`dotted none none`}},[`&-vertical${t}-dotted`]:{borderInlineStartWidth:i,borderInlineEnd:0,borderBlockStart:0,borderBlockEnd:0},[`&-plain${t}-with-text`]:{color:e.colorText,fontWeight:`normal`,fontSize:e.fontSize},[`&-horizontal${t}-with-text-start${t}-no-default-orientation-margin-start`]:{[`${c}-start`]:{width:0},[`${c}-end`]:{width:`100%`},[`${t}-inner-text`]:{paddingInlineStart:n}},[`&-horizontal${t}-with-text-end${t}-no-default-orientation-margin-end`]:{[`${c}-start`]:{width:`100%`},[`${c}-end`]:{width:0},[`${t}-inner-text`]:{paddingInlineEnd:n}}}}},k=s(`Divider`,e=>{let t=S(e,{dividerHorizontalWithTextGutterMargin:e.margin,sizePaddingEdgeHorizontal:0});return[O(t),D(t)]},e=>({textPaddingInline:`1em`,orientationMargin:.05,verticalMarginInline:e.marginXS}),{unitless:{orientationMargin:!0}}),A=e(y()),ie=[`left`,`right`,`center`,`start`,`end`],j=A.forwardRef((e,t)=>{let{getPrefixCls:n,direction:r,className:i,style:a,classNames:o,styles:s}=te(`divider`),{prefixCls:c,type:l,orientation:d,vertical:f,titlePlacement:p,orientationMargin:m,className:h,rootClassName:g,children:_,dashed:y,variant:b=`solid`,plain:x,style:S,size:C,classNames:w,styles:T,...D}=e,O=n(`divider`,c),j=`${O}-rail`,[M,N]=k(O),P=re(C),F=!!_,I=ie.includes(d||``),L=A.useMemo(()=>{let e=p??(I?d:`center`);return e===`left`?r===`rtl`?`end`:`start`:e===`right`?r===`rtl`?`start`:`end`:e},[r,d,p,I]),R=L===`start`&&m!=null,z=L===`end`&&m!=null,[B,V]=ee(d,f,l),H={...e,orientation:B,titlePlacement:L,size:P},U=v(a),[W,G]=u([o,w],[s,U,T],{props:H}),K=E(O,i,M,N,`${O}-${B}`,{[`${O}-with-text`]:F,[`${O}-with-text-${L}`]:F,[`${O}-dashed`]:!!y,[`${O}-${b}`]:b!==`solid`,[`${O}-plain`]:!!x,[`${O}-rtl`]:r===`rtl`,[`${O}-no-default-orientation-margin-start`]:R,[`${O}-no-default-orientation-margin-end`]:z,[`${O}-md`]:P===`medium`||P===`middle`,[`${O}-sm`]:P===`small`,[j]:!_,[W.rail]:W.rail&&!_},h,g,W.root),q=A.useMemo(()=>ne(m)?m:/^\d+$/.test(m)?Number(m):m,[m]),J={marginInlineStart:R?q:void 0,marginInlineEnd:z?q:void 0},Y=A.useRef(null);return A.useImperativeHandle(t,()=>({nativeElement:Y.current})),A.createElement(`div`,{ref:Y,className:K,style:{...G.root,..._?{}:G.rail,...S},...D,role:`separator`},_&&!V&&A.createElement(A.Fragment,null,A.createElement(`div`,{className:E(j,`${j}-start`,W.rail),style:G.rail}),A.createElement(`span`,{className:E(`${O}-inner-text`,W.content),style:{...J,...G.content}},_),A.createElement(`div`,{className:E(j,`${j}-end`,W.rail),style:G.rail})))}),M=``+new URL(`banner-video-CC9MkvaF.mp4`,import.meta.url).href,N=g(),P={viewerChannelSettings:{maskChannelName:``,groups:[{name:`Channels`,channels:[{match:[0],enabled:!0,lut:[`autoij`,`autoij`],color:`C3C3C3`},{match:[1],enabled:!1},{match:[2],enabled:!0,colorizeEnabled:!0}]}]},viewerSettings:{viewMode:l.xy,density:2.5}},F=[{name:`hiPSC FOV-nuclei timelapse datasets`,inReview:!1,description:(0,N.jsxs)(`p`,{children:[`3D timelapses of nuclei in growing hiPS cell colonies of three different starting sizes. Timelapse datasets include 3D transmitted-light bright-field and lamin B1-mEGFP fluorescence 20x images and 3D nuclear segmentation images. These datasets are`,` `,(0,N.jsx)(x,{href:`https://open.quiltdata.com/b/allencell/tree/aics/nuc-morph-dataset/hipsc_fov_nuclei_timelapse_dataset/hipsc_fov_nuclei_timelapse_data_used_for_analysis/baseline_colonies_fov_timelapse_dataset/`,children:`available for download on Quilt`}),` `,`.`]}),publicationInfo:{url:new URL(`https://doi.org/10.1016/j.cels.2025.101265`),name:`Colony context and size-dependent compensation mechanisms give rise to variations in nuclear growth trajectories`,citation:`Cell Systems, May 2025`},datasets:[{name:`Small colony`,loadParams:{imageUrl:{scenes:[[`https://allencell.s3.amazonaws.com/aics/nuc-morph-dataset/hipsc_fov_nuclei_timelapse_dataset/hipsc_fov_nuclei_timelapse_data_used_for_analysis/baseline_colonies_fov_timelapse_dataset/20200323_09_small/raw.ome.zarr`,`https://allencell.s3.amazonaws.com/aics/nuc-morph-dataset/hipsc_fov_nuclei_timelapse_dataset/hipsc_fov_nuclei_timelapse_data_used_for_analysis/baseline_colonies_fov_timelapse_dataset/20200323_09_small/seg.ome.zarr`]]},cellId:``,imageDownloadHref:``,parentImageDownloadHref:``,...P},hideTitle:!0},{name:`Medium colony`,loadParams:{imageUrl:{scenes:[[`https://allencell.s3.amazonaws.com/aics/nuc-morph-dataset/hipsc_fov_nuclei_timelapse_dataset/hipsc_fov_nuclei_timelapse_data_used_for_analysis/baseline_colonies_fov_timelapse_dataset/20200323_06_medium/raw.ome.zarr`,`https://allencell.s3.amazonaws.com/aics/nuc-morph-dataset/hipsc_fov_nuclei_timelapse_dataset/hipsc_fov_nuclei_timelapse_data_used_for_analysis/baseline_colonies_fov_timelapse_dataset/20200323_06_medium/seg.ome.zarr`]]},cellId:``,imageDownloadHref:``,parentImageDownloadHref:``,...P},hideTitle:!0},{name:`Large colony`,loadParams:{imageUrl:{scenes:[[`https://allencell.s3.amazonaws.com/aics/nuc-morph-dataset/hipsc_fov_nuclei_timelapse_dataset/hipsc_fov_nuclei_timelapse_data_used_for_analysis/baseline_colonies_fov_timelapse_dataset/20200323_05_large/raw.ome.zarr`,`https://allencell.s3.amazonaws.com/aics/nuc-morph-dataset/hipsc_fov_nuclei_timelapse_dataset/hipsc_fov_nuclei_timelapse_data_used_for_analysis/baseline_colonies_fov_timelapse_dataset/20200323_05_large/seg.ome.zarr`]]},cellId:``,imageDownloadHref:``,parentImageDownloadHref:``,...P},hideTitle:!0}]}];function I(e){let t={name:`AICS-10_5_5`,sizeX:64,sizeY:64,sizeZ:64,sizeC:3,physicalPixelSize:[1,1,1],spatialUnit:``,channelNames:[`DRAQ5`,`EGFP`,`SEG_Memb`]},n=[c.createSphere(64,64,64,24,e),c.createTorus(64,64,64,24,8,e),c.createCone(64,64,64,24,24,e)],r=c.concatenateArrays(n,e);return{metadata:t,data:{dtype:e,shape:[n.length,64,64,64],buffer:new DataView(r.buffer)}}}var L=I(`uint8`),R=I(`uint16`),z=I(`float32`),B={viewerChannelSettings:{maskChannelName:``,groups:[{name:`Channels`,channels:[{match:[0],enabled:!0,lut:[`autoij`,`autoij`]},{match:[1],enabled:!0,lut:[`autoij`,`autoij`]},{match:[2],enabled:!0,lut:[`autoij`,`autoij`]}]}]},viewerSettings:{viewMode:l.threeD,density:2.5}};L.data,L.metadata,{...B},R.data,R.metadata,{...B},z.data,z.metadata,{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B},{...B};var V=d.ul`
  padding: 0;
  width: 100%;
  display: grid;

  // Use grid + subgrid to align the title, description, and button for each horizontal
  // row of cards. repeat is used to tile the layout if the cards wrap to a new line.
  grid-template-rows: repeat(3, auto);
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  justify-content: space-around;
  text-align: start;
  gap: 0px 20px;
`,H=d.li`
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  grid-row-gap: 2px;
  min-width: 180px;
  margin-top: 20px;

  & > h3 {
    display: grid;
    margin: 0;
  }
  & > p {
    display: grid;
  }
  & > a,
  & > button {
    margin: 4px auto 0 0;
    display: grid;
  }
`;function U(e){let{dataset:t,index:n,onClickLoad:r}=e;return(0,N.jsxs)(H,{children:[(0,N.jsx)(`h3`,{children:t.name}),(0,N.jsx)(`p`,{children:t.description}),(0,N.jsx)(`div`,{children:(0,N.jsxs)(o,{type:`primary`,onClick:()=>r(t.loadParams,t.hideTitle),style:{paddingTop:5},children:[`Load`,(0,N.jsxs)(h,{children:[` dataset `,t.name]})]})})]},n)}function W(e){let{datasets:t,onClickLoad:n}=e;return(0,N.jsx)(V,{children:t.map((e,t)=>(0,N.jsx)(U,{dataset:e,index:t,onClickLoad:n},t))})}var G=d.li`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;

  & h3 {
    font-weight: 600;
  }

  & h2 {
    font-size: 20px;
  }

  & p,
  & h2,
  & span {
    margin: 0;
  }

  & a {
    // Add 2px margin to maintain the same visual gap that text has
    margin-top: 2px;
    text-decoration: underline;
  }

  & :first-child {
    // Add some visual separation beneath title element
    margin-bottom: 2px;
  }
`,K=d(C)`
  border-radius: 4px;
  padding: 1px 6px;
  border: 1px solid var(--color-flag-background);
  height: 23px;
  flex-wrap: wrap;

  && > p {
    color: var(--color-flag-text);
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 0;
    white-space: nowrap;
  }
`;function q(e){let{project:n,index:r,onClickLoad:i}=e,a=n.inReview?(0,N.jsxs)(C,{$gap:10,children:[(0,N.jsx)(`h2`,{children:n.name}),(0,N.jsx)(t,{title:`Final version of dataset will be released when associated paper is published`,children:(0,N.jsx)(K,{children:(0,N.jsx)(`p`,{children:`IN REVIEW`})})})]}):(0,N.jsx)(`h2`,{children:n.name}),s=n.publicationInfo,c=s?(0,N.jsxs)(`p`,{children:[`Related publication: `,(0,N.jsx)(x,{href:s.url.toString(),children:s.name}),` (`,s.citation,`)`]}):null,l=n.loadParams?(0,N.jsx)(`div`,{children:(0,N.jsxs)(o,{onClick:()=>i(n.loadParams,n.hideTitle),style:{paddingTop:5},children:[`Load`,(0,N.jsxs)(h,{children:[` dataset `,n.name]})]})}):null,u=n.datasets?(0,N.jsx)(W,{datasets:n.datasets,onClickLoad:i}):null;return(0,N.jsxs)(G,{children:[a,(0,N.jsx)(`p`,{children:n.description}),c,l,u]},r)}var J=d.ul`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  margin-top: 0;

  // Add a pseudo-element line between cards
  & > li:not(:first-child)::before {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background-color: var(--color-layout-dividers);
    margin-bottom: 15px;
  }
`;function Y(e){return(0,N.jsx)(J,{children:e.projects.map((t,n)=>(0,N.jsx)(q,{project:t,index:n,onClickLoad:e.onClickLoad},n))})}var X=1060,ae=d(p)`
  position: relative;
  --container-padding-x: 20px;
  padding: 40px var(--container-padding-x);
  overflow: hidden;
  margin: 0;
`,oe=d(p)`
  --padding-x: 30px;
  padding: 26px var(--padding-x);
  max-width: calc(${X}px - 2 * var(--padding-x));

  --total-padding-x: calc(2 * var(--padding-x) + 2 * var(--container-padding-x));
  width: calc(90vw - var(--total-padding-x));
  border-radius: 5px;
  background-color: var(--color-landingpage-banner-highlight-bg);
  gap: 20px;

  & h1 {
    margin: 0;
  }

  & h2 {
    color: var(--color-text-body);
    margin: 0;
  }

  && > p {
    font-size: 16px;
    margin: 0;
  }
`,se=d.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: -1;

  & > div {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(90deg, rgba(35, 25, 50, 0.5) 50%, rgba(0, 0, 0, 0) 70%);
    z-index: 3;
  }

  & > video {
    position: absolute;
    width: 100%;
    max-width: 1400px;
    height: 100%;
    left: 35%;
    object-fit: cover;
  }
`,Z=d(_)`
  max-width: ${X}px;
  width: calc(90vw - 40px);
  margin: auto;
  padding: 0 20px;
  gap: 20px;

  h2 {
    color: var(--color-text-header);
  }
`,Q=d.li`
  display: grid;
  width: 100%;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  padding: 0;
  justify-content: space-evenly;
  column-gap: 20px;
  margin: 30px 0 0 0;
`,$=d(_)`
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 2;
  margin-bottom: 20px;

  & > h3 {
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  & > p {
    margin: 0;
  }
`,ce=d(p)`
  background-color: var(--color-landingpage-bg-alt);
  // The lower margin on the top is required because of the 20px margin after FeatureHighlightsItem
  margin: 10px 0 30px 0;
  padding: 30px;
  & h2 {
    color: var(--color-text-header);
  }
`,le=d(o)`
  color: var(--color-text-body);
  &:focus-visible > span,
  &:hover > span {
    text-decoration: underline;
  }
`;function ue(e){let t=w(),[o]=m();(0,A.useEffect)(()=>{n(window.location.search).then(({args:e})=>{Object.keys(e).length>0&&(console.log(`Detected URL parameters. Redirecting from landing page to viewer.`),t(`viewer?`+o.toString(),{state:e,replace:!0}))})},[t,o]);let s=(e,n)=>{let r=n?`&hideTitle=true`:``;t(`/viewer?url=${i(e.imageUrl)}${r}`,{state:e})},[c,l]=(0,A.useState)(window.matchMedia(`(prefers-reduced-motion: no-preference)`).matches);return(0,A.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: no-preference)`);return e.addEventListener(`change`,()=>{l(e.matches)}),()=>{e.removeEventListener(`change`,()=>{l(e.matches)})}},[]),(0,N.jsxs)(`div`,{style:{backgroundColor:`var(--color-landingpage-bg)`,minHeight:`100%`},children:[(0,N.jsx)(T,{children:(0,N.jsxs)(C,{$gap:12,children:[(0,N.jsx)(C,{$gap:2,children:(0,N.jsx)(a,{onLoad:s})}),(0,N.jsx)(r,{})]})}),(0,N.jsxs)(ae,{children:[(0,N.jsxs)(se,{style:{zIndex:1},children:[(0,N.jsx)(`video`,{autoPlay:c,loop:!0,muted:!0,children:(0,N.jsx)(`source`,{src:M,type:`video/mp4`})}),(0,N.jsx)(`div`,{})]}),(0,N.jsxs)(oe,{style:{zIndex:1},children:[(0,N.jsxs)(p,{children:[(0,N.jsx)(`h1`,{children:`Vol-E`}),(0,N.jsx)(`h2`,{children:`An interactive, web-based viewer for 3D volume data`})]}),(0,N.jsx)(`p`,{children:`Vol-E (Volume Explorer) is an open-use online tool designed to visualize, analyze, and interpret multi-channel 3D microscopy data. Ideal for researchers, educators, and students, the viewer offers powerful interactive tools to extract key insights from imaging data.`})]})]}),(0,N.jsx)(Z,{children:(0,N.jsxs)(Q,{children:[(0,N.jsxs)($,{children:[(0,N.jsx)(`h3`,{children:`Multiresolution OME-Zarr support`}),(0,N.jsx)(`p`,{children:`Load your cloud-hosted OME-Zarr v0.4 and v0.5 images via http(s).`})]}),(0,N.jsxs)($,{children:[(0,N.jsx)(`h3`,{children:`Multiple viewing modes`}),(0,N.jsx)(`p`,{children:`Rotate and examine the volume in 3D, or focus on single Z slices in 2D at higher resolution.`})]}),(0,N.jsxs)($,{children:[(0,N.jsx)(`h3`,{children:`Time-series playthrough`}),(0,N.jsx)(`p`,{children:`Interactively explore dynamics and manipulate timelapse videos realtime in 2D or 3D.`})]}),(0,N.jsxs)($,{children:[(0,N.jsx)(`h3`,{children:`Customizable settings`}),(0,N.jsx)(`p`,{children:`Switch colors, toggle channels, and apply thresholds to reveal interesting features in data.`})]})]})}),(0,N.jsx)(ce,{children:(0,N.jsx)(`h2`,{style:{margin:0},children:`Load a dataset below or your own data to get started.`})}),(0,N.jsx)(Z,{style:{paddingBottom:`400px`},children:(0,N.jsx)(Y,{projects:F,onClickLoad:s})}),(0,N.jsxs)(Z,{style:{padding:`0 30px 40px 30px`,display:`block`},children:[(0,N.jsx)(j,{}),(0,N.jsx)(p,{style:{paddingTop:`20px`},children:(0,N.jsxs)(le,{type:`text`,className:`ot-sdk-show-settings`,children:[`Cookie settings`,(0,N.jsx)(h,{children:`(opens popup menu)`})]})})]})]})}export{ue as default};