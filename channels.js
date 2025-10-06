// Constants used within the channel list
const CONVRG_MANIFEST_BASE = 'https://convrgelive.nathcreqtives.com/001/2/';
const CONVRG_MANIFEST_SUFFIX = '/manifest.mpd?virtualDomain=001.live_hls.zte.com&IASHttpSessionId=OTT';
const CONVRG_LICENSE_URI = 'https://key.nathcreqtives.com/widevine/?deviceId=02:00:00:00:00:00';

// Helper to generate IDs (can be used here or imported if needed elsewhere)
function generateChannelId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '').substring(0, 20) || `ch${Date.now().toString(36)}`;
}

// The default list of channels
const defaultChannelList = [// --- Existing Channels ---
{
    name: "Cartoon Network HD",
    manifest: 'https://vod.nathcreqtives.com/1178/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, 
{
    name: "Dreamworks HD",
    manifest: 'https://ott.m3u8.nathcreqtives.com/dreamworkshd/stream/stream.m3u8',
    drm: null
}, 
{
    name: "ONE PH",
    manifest: 'https://vod.nathcreqtives.com/1198/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, 
{
    name: "Cinemo",
    manifest: 'https://vod.nathcreqtives.com/cinemo/stream/index.mpd',
    drm: null
}, {
    name: "Cinema One",
    manifest: 'https://vod.nathcreqtives.com/cinemaone/stream/index.mpd',
    drm: null
}, {
    name: "Disney Channel",
    manifest: 'https://ott.m3u8.nathcreqtives.com/disneychannel/stream/stream.m3u8',
    drm: null
}, {
    name: "GMA NEWS TV",
    manifest: 'https://ott.m3u8.nathcreqtives.com/gmanewstv/stream/stream.m3u8',
    drm: null
}, {
    name: "GMA 7",
    manifest: 'https://vod.nathcreqtives.com/1093/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "GMA Pinoy TV",
    manifest: 'https://ott.m3u8.nathcreqtives.com/gmapinoytv/stream/stream.m3u8',
    drm: null,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/GMA_Network_logo.svg/1200px-GMA_Network_logo.svg.png'
},



// Example Image URL
{
    name: "Jeepney TV",
    manifest: 'https://ott.m3u8.nathcreqtives.com/jeepneytv/stream/stream.m3u8',
    drm: null
}, {
    name: "Kapamilya HD",
    manifest: `https://vod.nathcreqtives.com/1286/manifest.mpd`,
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "PBO",
    manifest: 'https://vod.nathcreqtives.com/1078/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "SOLAR SPORTS",
    manifest: 'https://vod.nathcreqtives.com/1081/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "PREMIER FOOTBALL",
    manifest: 'https://vod.nathcreqtives.com/1127/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
    
}, {
    name: "USA TODAY",
    manifest: 'https://vod.nathcreqtives.com/1199/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "EUROSPORT (CON)",
    manifest: 'https://vod.nathcreqtives.com/1325/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Music Asia",
    manifest: 'https://vod.nathcreqtives.com/1325/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Rock of Manila TV",
    manifest: 'https://vod.nathcreqtives.com/1177/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }

}, {
    name: "KBS2",
    manifest: 'https://vod.nathcreqtives.com/1344/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }

}, {
    name: "HISTORY CHANNEL (CON)",
    manifest: 'https://vod.nathcreqtives.com/1074/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "TV5 HD",
    manifest: 'https://vod.nathcreqtives.com/1088/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "RPTV HD",
    manifest: 'https://vod.nathcreqtives.com/1094/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "True FM TV",
    manifest: 'https://qp-pldt-live-grp-08-prod.akamaized.net/out/u/truefm_tv.mpd',
    drm: {
        type: 'clearkey',
        keyId: '0559c95496d44fadb94105b9176c3579',
        key: '40d8bb2a46ffd03540e0c6210ece57ce'
    }
}, {
    name: "A2Z",
    manifest: 'https://vod.nathcreqtives.com/1087/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "PTV 4",
    manifest: 'https://vod.nathcreqtives.com/1086/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "IBC 13",
    manifest: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/ibc13_sd_new.mpd',
    drm: {
        type: 'clearkey',
        keyId: '16ecd238c0394592b8d3559c06b1faf5',
        key: '05b47ae3be1368912ebe28f87480fc84'
    }
}, {
    name: "Buko",
    manifest: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_buko_sd.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'd273c085f2ab4a248e7bfc375229007d',
        key: '7932354c3a84f7fc1b80efa6bcea0615'
    }
}, {
    name: "Sari-Sari",
    manifest: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_sari_sari_sd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '0a7ab3612f434335aa6e895016d8cd2d',
        key: 'b21654621230ae21714a5cab52daeb9d'
    }
}, {
    name: "tvN Movies Pinoy",
    manifest: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/cg_tvnmovie.mpd',
    drm: {
        type: 'clearkey',
        keyId: '2e53f8d8a5e94bca8f9a1e16ce67df33',
        key: '3471b2464b5c7b033a03bb8307d9fa35'
    }
}, {
    name: "NBA TV Philippines",
    manifest: 'https://vod.nathcreqtives.com/1064/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Premier Sports HD",
    manifest: 'https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_ps_hd1.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'b8b595299fdf41c1a3481fddeb0b55e4',
        key: 'cd2b4ad0eb286239a4a022e6ca5fd007'
    }
}, {
    name: "One Sports HD",
    manifest: 'https://ott.m3u8.nathcreqtives.com/onesports1/stream/stream.m3u8',
    drm: null
}, {
    name: "PBA Rush",
    manifest: 'https://ott.m3u8.nathcreqtives.com/pbarush/stream/stream.m3u8',
    drm: null
}, {
    name: "UAAP Varsity Channel",
    manifest: 'https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/cg_uaap_cplay_sd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '95588338ee37423e99358a6d431324b9',
        key: '6e0f50a12f36599a55073868f814e81e'
    }
}, {
    name: "One Sports+",
    manifest: 'https://ott.m3u8.nathcreqtives.com/onesportsplus/stream/stream.m3u8',
    drm: null
}, {
    name: "Tap Sports",
    manifest: 'https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_tapsports.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'eabd2d95c89e42f2b0b0b40ce4179ea0',
        key: '0e7e35a07e2c12822316c0dc4873903f'
    }
}, {
    name: "MPTV",
    manifest: 'https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_mptv.mpd',
    drm: {
        type: 'clearkey',
        keyId: '6aab8f40536f4ea98e7c97b8f3aa7d4e',
        key: '139aa5a55ade471faaddacc4f4de8807'
    }
}, {
    name: "Rock Entertainment",
    manifest: 'https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_rockentertainment.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'e4ee0cf8ca9746f99af402ca6eed8dc7',
        key: 'be2a096403346bc1d0bb0f812822bb62'
    }
}, {
    name: "Hits Now",
    manifest: 'https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_hitsnow.mpd',
    drm: {
        type: 'clearkey',
        keyId: '14439a1b7afc4527bb0ebc51cf11cbc1',
        key: '92b0287c7042f271b266cc11ab7541f1'
    }
}, {
    name: "Tap TV",
    manifest: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_taptv_sd.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'f6804251e90b4966889b7df94fdc621e',
        key: '55c3c014f2bd12d6bd62349658f24566'
    }
}, {
    name: "Global Trekker",
    manifest: 'https://qp-pldt-live-grp-04-prod.akamaized.net/out/u/globaltrekker.mpd',
    drm: {
        type: 'clearkey',
        keyId: '5c26c24bce2942078cf6e35216632c2d',
        key: '445887a1c0832ff457263d8bcadc993f'
    }
}, {
    name: "Warner TV HD",
    manifest: 'https://qp-pldt-live-grp-05-prod.akamaized.net/out/u/cg_warnerhd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '4503cf86bca3494ab95a77ed913619a0',
        key: 'afc9c8f627fb3fb255dee8e3b0fe1d71'
    }
}, {
    name: "HGTV HD",
    manifest: 'https://qp-pldt-live-grp-08-prod.akamaized.net/out/u/hgtv_hd1.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'f0e3ab943318471abc8b47027f384f5a',
        key: '13802a79b19cc3485d2257165a7ef62a'
    }
}, {
    name: "Food Network HD",
    manifest: 'https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_foodnetwork_hd1.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'b7299ea0af8945479cd2f287ee7d530e',
        key: 'b8ae7679cf18e7261303313b18ba7a14'
    }
}, {
    name: "Fashion TV HD",
    manifest: 'https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_fashiontvhd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '971ebbe2d887476398e97c37e0c5c591',
        key: '472aa631b1e671070a4bf198f43da0c7'
    }
}, {
    name: "Lifetime SD",
    manifest: 'https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_lifetime.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'cf861d26e7834166807c324d57df5119',
        key: '64a81e30f6e5b7547e3516bbf8c647d0'
    }
}, {
    name: "Hits HD",
    manifest: 'https://ott.m3u8.nathcreqtives.com/hits/stream/stream.m3u8',
    drm: null
}, {
    name: "HBO Family HD",
    manifest: 'https://ott.m3u8.nathcreqtives.com/hbofamilyhd/stream/stream.m3u8',
    drm: null
}, {
    name: "HBO Plus",
    manifest: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBOPLUSHD/default.mpd',
    drm: {
        type: 'clearkey',
        keyId: '861ab989089891d84ad0da296954437c',
        key: '3bdf94f9fc1888529f8d27d070d38566'
    }
}, {
    name: "HBO Boxing",
    manifest: 'https://ott.m3u8.nathcreqtives.com/hboboxing/stream/stream.m3u8',
    drm: null
}, {
    name: "HBO POP",
    manifest: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBOPOPHD/default.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'bcf36f412fa3d735cea04f7443fbf77c',
        key: '6ff29fb2d6b7d825eb06004650a0a4ea'
    }
}, {
    name: "HBO 3",
    manifest: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBOPOPHD/default.mpd',
    drm: {
        type: 'clearkey',
        keyId: '11223344556677889900112233445566',
        key: '4b80724d0ef86bcb2c21f7999d67739d'
    }
}, {
    name: "HBO 2",
    manifest: 'https://live-atv-cdn.izzigo.tv/5/out/u/dash/HBO2HD/default.mpd',
    drm: {
        type: 'clearkey',
        keyId: '09e84fc7ecb71def143cd7e2771f3b35',
        key: '1a91f2d315fb0593321ba60aa783ec2c'
    }
}, {
    name: "HBO HD",
    manifest: 'https://vod.nathcreqtives.com/1065/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Hits Movies",
    manifest: 'https://ott.m3u8.nathcreqtives.com/hitsmovies/stream/stream.m3u8',
    drm: null
}, {
    name: "TAP Movies HD",
    manifest: 'https://ott.m3u8.nathcreqtives.com/tapmovies/stream/stream.m3u8',
    drm: null
}, {
    name: "Rock Action",
    manifest: 'https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_rockextreme.mpd',
    drm: {
        type: 'clearkey',
        keyId: '0f852fb8412b11edb8780242ac120002',
        key: '4cbc004d8c444f9f996db42059ce8178'
    }
}, {
    name: "Tap Action Flix HD",
    manifest: 'https://ott.m3u8.nathcreqtives.com/tapactionflix/stream/stream.m3u8',
    drm: null
}, {
    name: "Cinemax HD",
    manifest: 'https://vod.nathcreqtives.com/1108/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "HBO Signature HD",
    manifest: 'https://vod.nathcreqtives.com/1285/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "HBO Hits HD",
    manifest: 'https://vod.nathcreqtives.com/1284/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "CNN HD",
    manifest: 'https://vod.nathcreqtives.com/1073/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "One News",
    manifest: 'https://ott.m3u8.nathcreqtives.com/onenews/stream/stream.m3u8',
    drm: null
}, {
    name: "Nick JR",
    manifest: 'https://vod.nathcreqtives.com/1215/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Nickelodeon HD",
    manifest: 'https://ott.m3u8.nathcreqtives.com/nickelodeon/stream/stream.m3u8',
}, {
    name: "Kix HD",
    manifest: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/kix_hd1.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'a8d5712967cd495ca80fdc425bc61d6b',
        key: 'f248c29525ed4c40cc39baeee9634735'
    }
}, {
    name: "Thrill SD",
    manifest: 'https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_thrill_sd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '928114ffb2394d14b5585258f70ed183',
        key: 'a82edc340bc73447bac16cdfed0a4c62'
    }
}, {
    name: "Viva Cinema",
    manifest: 'https://vod.nathcreqtives.com/1079/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Tagalog Movie Channel (TMC)",
    manifest: 'https://vod.nathcreqtives.com/1080/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "SPOTV HD",
    manifest: 'https://qp-pldt-live-grp-05-prod.akamaized.net/out/u/cg_spotvhd.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'ec7ee27d83764e4b845c48cca31c8eef',
        key: '9c0e4191203fccb0fde34ee29999129e'
    }
}, {
    name: "SPOTV 2 HD",
    manifest: 'https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_spotv2hd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '7eea72d6075245a99ee3255603d58853',
        key: '6848ef60575579bf4d415db1032153ed'
    }
}, {
    name: "TV Maria",
    manifest: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/tvmaria_prd.mpd',
    drm: {
        type: 'clearkey',
        keyId: 'fa3998b9a4de40659725ebc5151250d6',
        key: '998f1294b122bbf1a96c1ddc0cbb229f'
    }
}, {
    name: "Lotus Macau",
    manifest: 'https://qp-pldt-live-grp-07-prod.akamaized.net/out/u/lotusmacau_prd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '60dc692e64ea443a8fb5ac186c865a9b',
        key: '01bdbe22d59b2a4504b53adc2f606cc1'
    }
}, {
    name: "TVUP",
    manifest: 'https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/tvup_prd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '83e813ccd4ca4837afd611037af02f63',
        key: 'a97c515dbcb5dcbc432bbd09d15afd41'
    }
}, {
    name: "Premier Sports 2",
    manifest: 'https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_premiertennishd.mpd',
    drm: {
        type: 'clearkey',
        keyId: '59454adb530b4e0784eae62735f9d850',
        key: '61100d0b8c4dd13e4eb8b4851ba192cc'
    }
}, {
    name: "Cinema World (CON)",
    manifest: 'https://vod.nathcreqtives.com/1074/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Animax",
    manifest: 'https://ott.m3u8.nathcreqtives.com/animax/stream/stream.m3u8',
    drm: null
}, {
    name: "ANC",
    manifest: 'https://vod.nathcreqtives.com/1274/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Myx",
    manifest: 'https://vod.nathcreqtives.com/1252/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Teleradyo Serbisyo",
    manifest: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg01006-abs-cbn-teleradyo-dash-abscbnono/index.mpd',
    drm: {
        type: 'clearkey',
        keyId: '47c093e0c9fd4f80839a0337da3dd876',
        key: '50547394045b3d047dc7d92f57b5fb33'
    }
}, {
    name: "TFC",
    manifest: 'https://ott.m3u8.nathcreqtives.com/tfc/stream/stream.m3u8',
    drm: null
}, {
    name: "Eurosport 1",
    manifest: 'https://ottb.live.cf.ww.aiv-cdn.net/dub-nitro/live/clients/dash/enc/at8teepvrn/out/v1/ab8d59a847f046c88f07a7f3d115d7fe/cenc.mpd',
    drm: {
        type: 'clearkey',
        keyId: '15b830e0b73b0b8ef99786121997d5f5',
        key: '51646d5e500648c6a4e319c7861e963f'
    }
}, {
    name: "Eurosport 2", 
    manifest: 'https://ottb.live.cf.ww.aiv-cdn.net/dub-nitro/live/clients/dash/enc/crenwml9jf/out/v1/09518f97387b4ea5a69279a1aa1daf0a/cenc.mpd',
    drm: {
        type: 'clearkey',
        keyId: '7a98f8e748e2e14057e9f99ac8e3a025',
        key: 'a0d9aa1a419ced1f9f4c2804b92ee0f7'
    }
}, {
    name: "Aniplus",
    manifest: 'https://ott.m3u8.nathcreqtives.com/aniplus/stream/stream.m3u8',
    drm: null
}, {
    name: "Arirang",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Arirang/HLSv3-FTA/Arirang.m3u8',
    drm: null
}, {
    name: "BBC Earth",
    manifest: 'https://cdn3.skygo.mn/live/disk1/BBC_earth/HLSv3-FTA/BBC_earth.m3u8',
    drm: null
}, {
    name: "BBC Lifestyle",
    manifest: 'https://cdn3.skygo.mn/live/disk1/BBC_lifestyle/HLSv3-FTA/BBC_lifestyle.m3u8',
    drm: null
}, {
    name: "BBC News",
    manifest: 'https://cdn3.skygo.mn/live/disk1/BBC_News/HLSv3-FTA/BBC_News.m3u8',
    drm: null
}, {
    name: "Boomerang",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Boomerang/HLSv3-FTA/Boomerang.m3u8',
    drm: null
}, {
    name: "Bloomberg",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Bloomberg/HLSv3-FTA/Bloomberg.m3u8',
    drm: null
}, {
    name: "C1",
    manifest: 'https://cdn3.skygo.mn/live/disk1/C1/HLSv3-FTA/C1.m3u8',
    drm: null
}, {
    name: "CBeebies",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Cbeebies/HLSv3-FTA/Cbeebies.m3u8',
    drm: null
}, {
    name: "Channel 11",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Channel11/HLSv3-FTA/Channel11.m3u8',
    drm: null
}, {
    name: "Che",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Che/HLSv3-FTA/Che.m3u8',
    drm: null
}, {
    name: "Discovery Asia",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Discovery_Asia/HLSv3-FTA/Discovery_Asia.m3u8',
    drm: null
}, {
    name: "Dreambox",
    manifest: 'https://cdn2.skygo.mn/live/disk1/Dreambox/HLSv3-FTA/Dreambox.m3u8',
    drm: null
}, {
    name: "Eagle",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Eagle/HLSv3-FTA/Eagle.m3u8',
    drm: null
}, {
    name: "Education",
    manifest: 'https://cdn2.skygo.mn/live/disk1/Education/HLSv3-FTA/Education.m3u8',
    drm: null
}, {
    name: "ETV",
    manifest: 'https://cdn3.skygo.mn/live/disk1/ETV/HLSv3-FTA/ETV.m3u8',
    drm: null
}, {
    name: "Friday",
    manifest: 'https://cdn2.skygo.mn/live/disk1/Friday/HLSv3-FTA/Friday.m3u8',
    drm: null
}, {
    name: "Khugjim",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Khugjim/HLSv3-FTA/Khugjim.m3u8',
    drm: null
}, {
    name: "Lotus",
    manifest: 'https://cdn2.skygo.mn/live/disk1/Lotus/HLSv3-FTA/Lotus.m3u8',
    drm: null
}, {
    name: "Malchin",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Malchin/HLSv3-FTA/Malchin.m3u8',
    drm: null
}, {
    name: "Match Planeta",
    manifest: 'https://cdn2.skygo.mn/live/disk1/Match_Planeta/HLSv3-FTA/Match_Planeta.m3u8',
    drm: null
}, {
    name: "MIR",
    manifest: 'https://cdn3.skygo.mn/live/disk1/MIR/HLSv3-FTA/MIR.m3u8',
    drm: null
}, {
    name: "MN25",
    manifest: 'https://cdn2.skygo.mn/live/disk1/MN25/HLSv3-FTA/MN25.m3u8',
    drm: null
}, {
    name: "MNB",
    manifest: 'https://cdn3.skygo.mn/live/disk1/MNB/HLSv3-FTA/MNB.m3u8',
    drm: null
}, {
    name: "MNB World",
    manifest: 'https://cdn2.skygo.mn/live/disk1/MNB_World/HLSv3-FTA/MNB_World.m3u8',
    drm: null
}, {
    name: "MNCTV",
    manifest: 'https://cdn3.skygo.mn/live/disk1/MNCTV/HLSv3-FTA/MNCTV.m3u8',
    drm: null
}, {
    name: "Moviebox",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Moviebox/HLSv3-FTA/Moviebox.m3u8',
    drm: null
}, {
    name: "NHK World",
    manifest: 'https://cdn3.skygo.mn/live/disk1/NHK_World/HLSv3-FTA/NHK_World.m3u8',
    drm: null
}, {
    name: "NHK World Premium",
    manifest: 'https://cdn3.skygo.mn/live/disk1/NHK_World_Premium/HLSv3-FTA/NHK_World_Premium.m3u8',
    drm: null
}, {
    name: "ONTV",
    manifest: 'https://cdn3.skygo.mn/live/disk1/ONTV/HLSv3-FTA/ONTV.m3u8',
    drm: null
}, {
    name: "Parlament",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Parlament/HLSv3-FTA/Parlament.m3u8',
    drm: null
}, {
    name: "Pobeda",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Pobeda/HLSv3-FTA/Pobeda.m3u8',
    drm: null
}, {
    name: "Popcorn",
    manifest: 'https://cdn2.skygo.mn/live/disk1/Popcorn/HLSv3-FTA/Popcorn.m3u8',
    drm: null
}, {
    name: "RenTV",
    manifest: 'https://cdn3.skygo.mn/live/disk1/RenTV/HLSv3-FTA/RenTV.m3u8',
    drm: null
}, {
    name: "SBN",
    manifest: 'https://cdn3.skygo.mn/live/disk1/SBN/HLSv3-FTA/SBN.m3u8',
    drm: null
}, {
    name: "THT",
    manifest: 'https://cdn3.skygo.mn/live/disk1/THT/HLSv3-FTA/THT.m3u8',
    drm: null
}, {
    name: "TV Center",
    manifest: 'https://cdn3.skygo.mn/live/disk1/TV_center/HLSv3-FTA/TV_center.m3u8',
    drm: null
}, {
    name: "TAP SPORTS HD",
    manifest: 'https://amg19223-amg19223c2-amgplt0351.playout.now3.amagi.tv/playlist/amg19223-amg19223c2-amgplt0351/playlist.m3u8',
    drm: null
}, {
    name: "Blast Movies",
    manifest: 'https://ott.m3u8.nathcreqtives.com/blastmovies/stream/stream.m3u8',
    drm: null
}, {
    name: "Blast Sports",
    manifest: 'https://ott.m3u8.nathcreqtives.com/blastsports/stream/stream.m3u8',
    drm: null
}, {
    name: "TV4",
    manifest: 'https://cdn2.skygo.mn/live/disk1/TV4/HLSv3-FTA/TV4.m3u8',
    drm: null
}, {
    name: "TV7",
    manifest: 'https://cdn3.skygo.mn/live/disk1/TV7/HLSv3-FTA/TV7.m3u8',
    drm: null
}, {
    name: "Vremya",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Vremya/HLSv3-FTA/Vremya.m3u8',
    drm: null
}, {
    name: "Zoomoo",
    manifest: 'https://cdn3.skygo.mn/live/disk1/Zoomoo/HLSv3-FTA/Zoomoo.m3u8',
    drm: null
}, {
    name: "Comedy Central",
    manifest: 'https://fl3.moveonjoy.com/Comedy_Central/index.m3u8',
    drm: null
}, {
    name: "Animal Planet",
    manifest: 'https://vod.nathcreqtives.com/1335/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "Discovery Channel",
    manifest: 'https://vod.nathcreqtives.com/1194/manifest.mpd',
    drm: {
        type: 'widevine',
        serverURL: CONVRG_LICENSE_URI
    }
}, {
    name: "HBO Comedy",
    manifest: 'https://fl3.moveonjoy.com/HBO_COMEDY/index.m3u8',
    drm: null
}, {
    name: "NBA TV USA",
    manifest: 'https://fl3.moveonjoy.com/NBA_TV/index.m3u8',
    drm: null
}, {
    name: "Fox Sports 1",
    manifest: 'https://fl3.moveonjoy.com/FOX_Sports_1/index.m3u8',
    drm: null
}, {
    name: "Fox Sports 2",
    manifest: 'https://fl3.moveonjoy.com/FOX_Sports_2/index.m3u8',
    drm: null
}, {
    name: "National Geographic",
    manifest: 'https://fl3.moveonjoy.com/National_Geographic/index.m3u8',
    drm: null
}, {
    name: "Nat Geo Wild",
    manifest: 'https://fl3.moveonjoy.com/Nat_Geo_Wild/index.m3u8',
    drm: null
}, {
    name: "TNT",
    manifest: 'https://fl5.moveonjoy.com/TNT/index.m3u8',
    drm: null
}, {
    name: "PPV 1",
    manifest: 'https://fl5.moveonjoy.com/PPV_1/index.m3u8',
    drm: null
}, {
    name: "PPV 2",
    manifest: 'https://fl5.moveonjoy.com/PPV_2/index.m3u8',
    drm: null
}, {
    name: "PPV 3",
    manifest: 'https://fl5.moveonjoy.com/PPV_3/index.m3u8',
    drm: null
}, {
    name: "PPV 4",
    manifest: 'https://fl5.moveonjoy.com/PPV_4/index.m3u8',
    drm: null
}, {
    name: "PPV 5",
    manifest: 'https://fl5.moveonjoy.com/PPV_5/index.m3u8',
    drm: null
}, {
    name: "HBO Zone",
    manifest: 'https://fl5.moveonjoy.com/HBO_ZONE/index.m3u8',
    drm: null
}, {
    name: "Disney Junior",
    manifest: 'https://ott.m3u8.nathcreqtives.com/disneyjr/stream/stream.m3u8',
    drm: null
}, {
    name: "Nick Teen",
    manifest: 'https://fl3.moveonjoy.com/Teen_Nick/index.m3u8',
    drm: null
}, {
    name: "Nickelodeon USA",
    manifest: 'https://fl3.moveonjoy.com/NICKELODEON/index.m3u8',
    drm: null
}, {
    name: "Paramount Network",
    manifest: 'https://ott.m3u8.nathcreqtives.com/paramountnetwork/stream/stream.m3u8',
    drm: null
}, {
    name: "HBO 2",
    manifest: 'https://fl5.moveonjoy.com/HBO_2/index.m3u8',
    drm: null
}, {
    name: "Disney XD",
    manifest: 'https://ott.m3u8.nathcreqtives.com/disneyxd/stream/stream.m3u8',
    drm: null
},
  {
    name: "ESPN",
    manifest: 'https://ott.m3u8.nathcreqtives.com/espn/stream/stream.m3u8',
    drm: null
  }, {
    name: "ESPN 2",
    manifest: 'https://ott.m3u8.nathcreqtives.com/espn2/stream/stream.m3u8',
    drm: null
  }, {
    name: "ESPN 3",
    manifest: 'https://ott.m3u8.nathcreqtives.com/espn3/stream/stream.m3u8',
    drm: null
  }, {
    name: "Cinemax 2",
    manifest: 'https://ott.m3u8.nathcreqtives.com/cinemax2/stream/stream.m3u8',
    drm: null
  },
].map(channel => {
    // Ensure all channels have an ID
    if (!channel.id) {
        channel.id = generateChannelId(channel.name);
    }
    
    // Proxify PLDT manifest URLs
// Proxify PLDT manifest URLs to use your Nginx server
//if (channel.manifest && channel.manifest.includes('qp-pldt-live-grp')) {
 //   try {
 //       const url = new URL(channel.manifest);
        // Use a regular expression to reliably find the group name (e.g., "grp-08")
  //      const match = url.hostname.match(/grp-\d+/);

   //     if (match) {
  //          const groupName = match[0]; // This will correctly get 'grp-08', 'grp-12', etc.
   //         const manifestName = url.pathname.split('/').pop();

            // Construct the correct URL for your Nginx proxy
   //         channel.manifest = `https://proxy.nathcreqtives.com/api/akamai/${groupName}/${manifestName}`;
   //     }
  //  } catch (e) {
  //      console.error("Failed to parse PLDT manifest URL:", channel.manifest, e);
        // Keep original URL if parsing fails
  //  }
//}
    
    // Optional: Ensure basic structure for consistency if needed later
    if (!channel.drm)
        channel.drm = null;
    if (!channel.image)
        channel.image = null;
    // Default image handled in UI
    return channel;
}
);

// Export the processed list
export {defaultChannelList, generateChannelId};
