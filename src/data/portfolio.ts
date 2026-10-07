export const portfolioTypes = [
  { id: 'photography', label: 'PHOTOGRAPHY' },
  { id: 'videography', label: 'VIDEOGRAPHY' },
] as const;

export type PortfolioRatio = '1:1' | '3:2' | '4:3' | '3:4' | '4:5' | '5:4' | '7:5' | '9:16' | '16:9';

export type PortfolioPost = string | {
  url: string;
  ratio?: PortfolioRatio;
  publishedAt?: string;
};

export interface PortfolioBrandLogo {
  file: string;
  maxWidth: number;
  maxHeight: number;
  mobileMaxWidth?: number;
  mobileMaxHeight?: number;
}

export interface PortfolioBrand {
  id: string;
  name: string;
  instagramProfileUrl: string;
  color: string;
  textColor: string;
  logo: PortfolioBrandLogo;
  photography: PortfolioPost[];
  videography: PortfolioPost[];
}

export function portfolioPostUrl(post: PortfolioPost) {
  return typeof post === 'string' ? post : post.url;
}

export function portfolioPostRatio(post: PortfolioPost) {
  return typeof post === 'string' ? undefined : post.ratio;
}

const INSTAGRAM_SHORTCODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const INSTAGRAM_EPOCH_MS = 1314220021721n;
const BANGKOK_OFFSET_MS = 7n * 60n * 60n * 1000n;

export function instagramPostPublishedAtFromUrl(url: string) {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#]+)/i);
  if (!match) return undefined;

  let mediaId = 0n;
  for (const character of match[1]) {
    const value = INSTAGRAM_SHORTCODE_ALPHABET.indexOf(character);
    if (value < 0) return undefined;
    mediaId = mediaId * 64n + BigInt(value);
  }

  const timestamp = (mediaId >> 23n) + INSTAGRAM_EPOCH_MS + BANGKOK_OFFSET_MS;
  const date = new Date(Number(timestamp));
  return Number.isFinite(date.valueOf()) ? date.toISOString().slice(0, 10) : undefined;
}

export function portfolioPostPublishedAt(post: PortfolioPost) {
  const explicit = typeof post === 'string' ? undefined : post.publishedAt;
  return explicit ?? instagramPostPublishedAtFromUrl(portfolioPostUrl(post));
}

function parsedPublishedAt(post: PortfolioPost) {
  const value = portfolioPostPublishedAt(post);
  if (!value) return undefined;

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

export function sortPortfolioPosts(
  posts: PortfolioPost[],
  direction: 'newest' | 'oldest' = 'newest'
) {
  return posts
    .map((post, index) => ({ post, index, publishedAt: parsedPublishedAt(post) }))
    .sort((a, b) => {
      if (a.publishedAt !== undefined && b.publishedAt !== undefined) {
        return direction === 'newest'
          ? b.publishedAt - a.publishedAt
          : a.publishedAt - b.publishedAt;
      }

      if (a.publishedAt !== undefined) return -1;
      if (b.publishedAt !== undefined) return 1;

      return a.index - b.index;
    })
    .map(item => item.post);
}

// New portfolio links should be stored with publishedAt from Instagram's actual taken_at timestamp.
// If publishedAt is omitted, instagramPostPublishedAtFromUrl() provides a shortcode-based Bangkok-date fallback.
// Add ratio only when a post differs from the Photography 4:5 or Videography 9:16 default.
// Home and Portfolio sort from publishedAt and use it for date-range filtering.
export const portfolioBrands: PortfolioBrand[] = [
  {
    id: 'haab', name: 'HAAB',
    instagramProfileUrl: 'https://www.instagram.com/haab.bkk/',
    color: '#C7242B', textColor: '#FFFFFF',
    logo: { file: 'HAAB.svg', maxWidth: 320, maxHeight: 100, mobileMaxWidth: 240, mobileMaxHeight: 58 },
    photography: [
      // Paste Photography URLs below
      { url: 'https://www.instagram.com/p/Dd8HQtryq4U/', ratio: '3:4', publishedAt: '2026-10-01' },
      { url: 'https://www.instagram.com/p/Dd8GiEsyRnE/', ratio: '3:4', publishedAt: '2026-10-01' },
      { url: 'https://www.instagram.com/p/Dd8FuGMS1v4/', ratio: '3:4', publishedAt: '2026-10-01' },
      { url: 'https://www.instagram.com/p/DdyncNOEq8w/?img_index=1', ratio: '3:4', publishedAt: '2026-09-27' },
      { url: 'https://www.instagram.com/p/DdsjY1PkmX1/?img_index=1', ratio: '3:4', publishedAt: '2026-09-25' },
      { url: 'https://www.instagram.com/p/Ddq721uEtsD/?img_index=1', ratio: '3:4', publishedAt: '2026-09-24' },
      { url: 'https://www.instagram.com/p/DbxAlgoEktp/?img_index=1', ratio: '3:4', publishedAt: '2026-08-08' },
      { url: 'https://www.instagram.com/p/DcA970-EpGs/?img_index=1', ratio: '3:4', publishedAt: '2026-08-14' },
      { url: 'https://www.instagram.com/p/DcA9alskmI2/?img_index=1', ratio: '3:4', publishedAt: '2026-08-14' },
      { url: 'https://www.instagram.com/p/DcA85P5kivG/?img_index=1', ratio: '3:4', publishedAt: '2026-08-14' },
      { url: 'https://www.instagram.com/p/DbGEmbWEmLe/?img_index=1', publishedAt: '2026-07-22' },
      { url: 'https://www.instagram.com/p/DbCoDN2EV1E/?img_index=1', publishedAt: '2026-07-21' },
      { url: 'https://www.instagram.com/p/Da4H_K7ErxI/?img_index=1', ratio: '3:4', publishedAt: '2026-07-17' },
      { url: 'https://www.instagram.com/p/Dah6PhuEvJK/?img_index=1', publishedAt: '2026-07-08' },
      { url: 'https://www.instagram.com/p/DadBMswkqfX/?img_index=1', publishedAt: '2026-07-06' },
      { url: 'https://www.instagram.com/p/DaZekgaERjm/?img_index=1', ratio: '3:4', publishedAt: '2026-07-05' },
      { url: 'https://www.instagram.com/p/DaVJyptkhl6/?img_index=1', publishedAt: '2026-07-03' },
      { url: 'https://www.instagram.com/p/DYo-MH9Enr3/?img_index=1', ratio: '3:4', publishedAt: '2026-05-22' },
      { url: 'https://www.instagram.com/p/DYj0NwMkrGW/?img_index=1', ratio: '3:4', publishedAt: '2026-05-20' },
      { url: 'https://www.instagram.com/p/DX9ROzlkpSM/?img_index=1', ratio: '3:4', publishedAt: '2026-05-05' },
      { url: 'https://www.instagram.com/p/DXs5FVdkf2h/?img_index=1', ratio: '3:4', publishedAt: '2026-04-29' },
      { url: 'https://www.instagram.com/p/DXgA9esEVY-/?img_index=1', ratio: '3:4', publishedAt: '2026-04-24' },
      { url: 'https://www.instagram.com/p/DXdwqI1kezl/?img_index=1', ratio: '3:4', publishedAt: '2026-04-23' },
      { url: 'https://www.instagram.com/p/DXbuM1uEq0i/', ratio: '3:4', publishedAt: '2026-04-22' },
      { url: 'https://www.instagram.com/p/DXOEV9skRe-/?img_index=1', ratio: '3:4', publishedAt: '2026-04-17' },
      { url: 'https://www.instagram.com/p/DXMHMkzEgab/?img_index=1', ratio: '3:4', publishedAt: '2026-04-16' },
      { url: 'https://www.instagram.com/p/DW-l_HQkpB_/?img_index=1', ratio: '3:4', publishedAt: '2026-04-11' },
      { url: 'https://www.instagram.com/p/DW82nNpEoeM/?img_index=1', ratio: '3:4', publishedAt: '2026-04-10' },
      { url: 'https://www.instagram.com/p/DW6ezvpEs0A/', ratio: '3:4', publishedAt: '2026-04-09' },
      { url: 'https://www.instagram.com/p/DW59tlOEYOI/', ratio: '3:4', publishedAt: '2026-04-09' },
      { url: 'https://www.instagram.com/p/DW5fFSekZqw/', ratio: '3:4', publishedAt: '2026-04-09' },
      { url: 'https://www.instagram.com/p/DWycVJqEr8x/?img_index=1', publishedAt: '2026-04-06' },
      { url: 'https://www.instagram.com/p/DWv5GKvEqWe/?img_index=1', ratio: '3:4', publishedAt: '2026-04-05' },
      { url: 'https://www.instagram.com/p/DWp_wJTkT1E/?img_index=1', ratio: '3:4', publishedAt: '2026-04-03' },
      { url: 'https://www.instagram.com/p/DWna6bOkreZ/?img_index=1', publishedAt: '2026-04-02' },
      { url: 'https://www.instagram.com/p/DWk3k5bkaW0/?img_index=1', ratio: '3:4', publishedAt: '2026-04-01' },
      { url: 'https://www.instagram.com/p/DWbByJsEqdm/?img_index=1', ratio: '3:4', publishedAt: '2026-03-28' },
      { url: 'https://www.instagram.com/p/DWYn6hbkonV/', publishedAt: '2026-03-27' },
      { url: 'https://www.instagram.com/p/DWWUnNaEs6H/?img_index=1', publishedAt: '2026-03-26' },
      { url: 'https://www.instagram.com/p/DWRKecwkgxc/', ratio: '3:4', publishedAt: '2026-03-24' },
      { url: 'https://www.instagram.com/p/DWOL2YvEe2U/', ratio: '3:4', publishedAt: '2026-03-23' },
      { url: 'https://www.instagram.com/p/DWL_agqkg1T/', ratio: '3:4', publishedAt: '2026-03-22' },
      { url: 'https://www.instagram.com/p/DUchS_8krZt/?img_index=1', ratio: '3:4', publishedAt: '2026-02-07' },
      { url: 'https://www.instagram.com/p/DULC9iXEg7t/?img_index=1', ratio: '16:9', publishedAt: '2026-01-31' },
      { url: 'https://www.instagram.com/p/DUIXW55EuXd/?img_index=1', ratio: '5:4', publishedAt: '2026-01-30' },
      { url: 'https://www.instagram.com/p/DT4U0RWkugI/?img_index=1', ratio: '5:4', publishedAt: '2026-01-24' },
      { url: 'https://www.instagram.com/p/DT0IILKEuyG/?img_index=1', ratio: '3:4', publishedAt: '2026-01-22' },
      { url: 'https://www.instagram.com/p/DSrLy_CkjC2/?img_index=1', ratio: '3:4', publishedAt: '2025-12-25' },
      { url: 'https://www.instagram.com/p/DSAb3XZkt1Q/?img_index=1', ratio: '3:4', publishedAt: '2025-12-08' },
      { url: 'https://www.instagram.com/p/DRG3boTEozT/?img_index=1', ratio: '3:4', publishedAt: '2025-11-16' },
      { url: 'https://www.instagram.com/p/DQeGYtSEvGL/?img_index=1', ratio: '3:4', publishedAt: '2025-10-31' },
      { url: 'https://www.instagram.com/p/DQb3qiOkvqh/?img_index=1', ratio: '3:4', publishedAt: '2025-10-30' },
      { url: 'https://www.instagram.com/p/DQDtUUQEs87/?img_index=1', ratio: '3:4', publishedAt: '2025-10-21' },
      { url: 'https://www.instagram.com/p/DP5dm-REmHJ/?img_index=1', ratio: '3:4', publishedAt: '2025-10-17' },
      { url: 'https://www.instagram.com/p/DOkagO2ku0w/?img_index=1', ratio: '1:1', publishedAt: '2025-09-14' },
      { url: 'https://www.instagram.com/p/DOYX81xEhfY/?img_index=1', ratio: '1:1', publishedAt: '2025-09-09' },
      { url: 'https://www.instagram.com/p/DMFqFUMS-t2/?img_index=1', ratio: '1:1', publishedAt: '2025-07-14' },
      { url: 'https://www.instagram.com/p/DL2S37lTboO/?img_index=1', ratio: '1:1', publishedAt: '2025-07-08' },
      { url: 'https://www.instagram.com/p/DHYUk-ATY9H/?img_index=1', publishedAt: '2025-03-19' },
      { url: 'https://www.instagram.com/p/DHXaPdezNsb/?img_index=1', ratio: '1:1', publishedAt: '2025-03-19' },
      { url: 'https://www.instagram.com/p/DHTJ8JMTCFk/?img_index=1', publishedAt: '2025-03-17' },
      { url: 'https://www.instagram.com/p/DHNzMuITZir/?img_index=1', publishedAt: '2025-03-15' },
      { url: 'https://www.instagram.com/p/DF5JE-eTLSI/?img_index=1', publishedAt: '2025-02-10' },
      { url: 'https://www.instagram.com/p/DF2XYcqzWbn/?img_index=1', publishedAt: '2025-02-09' },
      { url: 'https://www.instagram.com/p/DFagHrwSKon/?img_index=1', ratio: '1:1', publishedAt: '2025-01-29' },
      { url: 'https://www.instagram.com/p/DFDNGMdTY93/?img_index=1', ratio: '1:1', publishedAt: '2025-01-20' },
      { url: 'https://www.instagram.com/p/DEeyHofTvu2/?img_index=1', ratio: '1:1', publishedAt: '2025-01-06' },
      { url: 'https://www.instagram.com/p/DDElT5xTQzI/?img_index=1', ratio: '1:1', publishedAt: '2024-12-02' },
    ],
    videography: [
      // Paste Videography URLs below
      { url: 'https://www.instagram.com/p/Dd1HpOFSgro/', publishedAt: '2026-09-28' },
      { url: 'https://www.instagram.com/p/DcVm4bcSzmh/', publishedAt: '2026-08-22' },
      { url: 'https://www.instagram.com/p/DbNAVnxxagg/', publishedAt: '2026-07-25' },
      { url: 'https://www.instagram.com/p/DbAutBfh1M-/', publishedAt: '2026-07-20' },
      { url: 'https://www.instagram.com/p/DapkoCTymG1/', publishedAt: '2026-07-11' },
      { url: 'https://www.instagram.com/p/DaeoaEsRTgm/', publishedAt: '2026-07-07' },
      { url: 'https://www.instagram.com/p/DX1UIqWx9nq/', publishedAt: '2026-05-02' },
      { url: 'https://www.instagram.com/p/DXqZSSFEUdR/', publishedAt: '2026-04-28' },
      { url: 'https://www.instagram.com/p/DXobghFESNy/', publishedAt: '2026-04-27' },
      { url: 'https://www.instagram.com/p/DSmoHESCntN/', publishedAt: '2025-12-23' },
      { url: 'https://www.instagram.com/p/DXioG60kc_x/', publishedAt: '2026-04-25' },
      { url: 'https://www.instagram.com/p/DScU4FhCWPP/', publishedAt: '2025-12-19' },
      { url: 'https://www.instagram.com/p/DSaGTinEi38/', publishedAt: '2025-12-18' },
      { url: 'https://www.instagram.com/p/DSPc8U2len3/', publishedAt: '2025-12-14' },
      { url: 'https://www.instagram.com/p/DSKMeUzCcnU/', ratio: '16:9', publishedAt: '2025-12-12' },
      { url: 'https://www.instagram.com/p/DQJeLfCEi2W/', publishedAt: '2025-10-23' },
      { url: 'https://www.instagram.com/p/DPjJjL6EstB/', publishedAt: '2025-10-08' },
      { url: 'https://www.instagram.com/p/DOnsHtTkpXc/', publishedAt: '2025-09-15' },
      { url: 'https://www.instagram.com/p/DH8QAshzqcj/', publishedAt: '2025-04-02' },
      { url: 'https://www.instagram.com/p/DFkfYxfz--T/', publishedAt: '2025-02-02' },
      { url: 'https://www.instagram.com/p/DEclEuHzkit/', publishedAt: '2025-01-05' },
      { url: 'https://www.instagram.com/p/DDoxCebzpQV/', publishedAt: '2024-12-16' },
    ],
  },
  {
    id: 'layers', name: 'Layers',
    instagramProfileUrl: 'https://www.instagram.com/layers.bkk/',
    color: '#014436', textColor: '#FFFFFF',
    logo: { file: 'Layers.svg', maxWidth: 320, maxHeight: 85, mobileMaxWidth: 240, mobileMaxHeight: 58 },
    photography: [
      // Paste Photography URLs below
      { url: 'https://www.instagram.com/p/Dd54lGSFAjz/?img_index=1', publishedAt: '2026-09-30' },
      { url: 'https://www.instagram.com/p/DbGHkUkgJU1/', publishedAt: '2026-07-22' },
      { url: 'https://www.instagram.com/p/Dcvtd85lJA0/?img_index=1', ratio: '3:4', publishedAt: '2026-09-01' },
      { url: 'https://www.instagram.com/p/DciwqgJFK5i/?img_index=1', ratio: '3:4', publishedAt: '2026-08-27' },
      { url: 'https://www.instagram.com/p/DcgHQ3elC7A/?img_index=1', ratio: '3:4', publishedAt: '2026-08-26' },
      { url: 'https://www.instagram.com/p/DcaUTucg_y3/', ratio: '3:4', publishedAt: '2026-08-24' },
      { url: 'https://www.instagram.com/p/DZzI6llFNYh/?img_index=1', ratio: '3:4', publishedAt: '2026-06-20' },
      { url: 'https://www.instagram.com/p/DZwqLLelNjS/?img_index=1', publishedAt: '2026-06-19' },
      { url: 'https://www.instagram.com/p/DZwpvnxlOfD/?img_index=1', publishedAt: '2026-06-19' },
      { url: 'https://www.instagram.com/p/DW8L2Q1AL--/', publishedAt: '2026-04-10' },
      { url: 'https://www.instagram.com/p/DWY03wkgA5D/', ratio: '3:4', publishedAt: '2026-03-27' },
      { url: 'https://www.instagram.com/p/DWLnwgGgC8u/', ratio: '3:4', publishedAt: '2026-03-22' },
      { url: 'https://www.instagram.com/p/DWJT-V2AK-k/', ratio: '3:4', publishedAt: '2026-03-21' },
      { url: 'https://www.instagram.com/p/DT4oPL1EwXU/?img_index=1', ratio: '16:9', publishedAt: '2026-01-24' },
      { url: 'https://www.instagram.com/p/DTSlUTFk9YS/', ratio: '3:4', publishedAt: '2026-01-09' },
      { url: 'https://www.instagram.com/p/DTDEHJXk-Fz/?img_index=1', ratio: '3:4', publishedAt: '2026-01-03' },
      { url: 'https://www.instagram.com/p/DS7SjKnE3Ep/?img_index=1', ratio: '3:4', publishedAt: '2025-12-31' },
      { url: 'https://www.instagram.com/p/DS2IH0WE37s/?img_index=1', ratio: '16:9', publishedAt: '2025-12-29' },
      { url: 'https://www.instagram.com/p/DSwfBTjkwg6/?img_index=1', ratio: '3:4', publishedAt: '2025-12-27' },
      { url: 'https://www.instagram.com/p/DSrg1Gnk3Hm/?img_index=1', ratio: '3:4', publishedAt: '2025-12-25' },
      { url: 'https://www.instagram.com/p/DSj50yik6sT/', ratio: '3:4', publishedAt: '2025-12-22' },
      { url: 'https://www.instagram.com/p/DShjMQhEzCW/?img_index=1', ratio: '3:4', publishedAt: '2025-12-21' },
      { url: 'https://www.instagram.com/p/DSSLM17kz9L/?img_index=1', ratio: '3:4', publishedAt: '2025-12-15' },
      { url: 'https://www.instagram.com/p/DSPhS-aEx6j/?img_index=1', ratio: '3:4', publishedAt: '2025-12-14' },
      { url: 'https://www.instagram.com/p/DSO5HsCE_bQ/?img_index=1', ratio: '3:4', publishedAt: '2025-12-14' },
      { url: 'https://www.instagram.com/p/DSJxYLZk-1P/?img_index=1', ratio: '3:4', publishedAt: '2025-12-12' },
      { url: 'https://www.instagram.com/p/DRd2m6xk0Y8/?img_index=1', ratio: '3:4', publishedAt: '2025-11-25' },
      { url: 'https://www.instagram.com/p/DQ_zwIqEwLd/?img_index=1', ratio: '3:4', publishedAt: '2025-11-13' },
      { url: 'https://www.instagram.com/p/DQy1cgLE_wC/?img_index=1', ratio: '3:4', publishedAt: '2025-11-08' },
      { url: 'https://www.instagram.com/p/DQWiExlE0NR/?img_index=1', ratio: '3:4', publishedAt: '2025-10-28' },
      { url: 'https://www.instagram.com/p/DP3pfVck0MC/?img_index=1', publishedAt: '2025-10-16' },
      { url: 'https://www.instagram.com/p/DPtW-qNE88a/?img_index=1', publishedAt: '2025-10-12' },
      { url: 'https://www.instagram.com/p/DPqdQFRE6RE/?img_index=1', publishedAt: '2025-10-11' },
      { url: 'https://www.instagram.com/p/DPWLo9VkwX7/?img_index=1', publishedAt: '2025-10-03' },
      { url: 'https://www.instagram.com/p/DPREXVeE5EA/?img_index=1', publishedAt: '2025-10-01' },
      { url: 'https://www.instagram.com/p/DPOiPUUkzZ8/?img_index=1', publishedAt: '2025-09-30' },
      { url: 'https://www.instagram.com/p/DPL_D_Bk3Tr/?img_index=1', publishedAt: '2025-09-29' },
      { url: 'https://www.instagram.com/p/DPGs3TME63m/', publishedAt: '2025-09-27' },
      { url: 'https://www.instagram.com/p/DOx_7oAE1xw/?img_index=1', ratio: '16:9', publishedAt: '2025-09-19' },
      { url: 'https://www.instagram.com/p/DOvUk9uE7hS/?img_index=1', ratio: '3:4', publishedAt: '2025-09-18' },
      { url: 'https://www.instagram.com/p/DOa4VHeE3_L/?img_index=1', publishedAt: '2025-09-10' },
      { url: 'https://www.instagram.com/p/DOYUP0pk4lq/?img_index=1', publishedAt: '2025-09-09' },
      { url: 'https://www.instagram.com/p/DOLQnkLk0le/?img_index=1', ratio: '16:9', publishedAt: '2025-09-04' },
      { url: 'https://www.instagram.com/p/DN-VovoE5a8/?img_index=1', publishedAt: '2025-08-30' },
      { url: 'https://www.instagram.com/p/DNxI5PV5l0S/?img_index=1', publishedAt: '2025-08-25' },
      { url: 'https://www.instagram.com/p/DMuvcZdzrSA/', publishedAt: '2025-07-30' },
      { url: 'https://www.instagram.com/p/DMkIkvJzp3D/?img_index=1', publishedAt: '2025-07-26' },
      { url: 'https://www.instagram.com/p/DMcs73dzGwz/?img_index=1', publishedAt: '2025-07-23' },
      { url: 'https://www.instagram.com/p/DLhYyD4T7qE/?img_index=1', publishedAt: '2025-06-30' },
      { url: 'https://www.instagram.com/p/DI5o7MzTgM6/?img_index=1', publishedAt: '2025-04-26' },
      { url: 'https://www.instagram.com/p/DI3gxqgTR_F/?img_index=1', publishedAt: '2025-04-25' },
      { url: 'https://www.instagram.com/p/DI3XnZiTcVl/?img_index=1', publishedAt: '2025-04-25' },
      { url: 'https://www.instagram.com/p/DIyXYS3zdne/?img_index=1', publishedAt: '2025-04-23' },
      { url: 'https://www.instagram.com/p/DIv1XCXPdEO/?img_index=1', publishedAt: '2025-04-22' },
      { url: 'https://www.instagram.com/p/DIgD7MfzD6a/?img_index=1', publishedAt: '2025-04-16' },
      { url: 'https://www.instagram.com/p/DIRH1tMT3OT/', publishedAt: '2025-04-10' },
      { url: 'https://www.instagram.com/p/DIOW5j0TMsp/?img_index=1', publishedAt: '2025-04-09' },
      { url: 'https://www.instagram.com/p/DHszwMvzs3Y/?img_index=2', publishedAt: '2025-03-27' },
      { url: 'https://www.instagram.com/p/DHlUL7zPSMO/?img_index=1', publishedAt: '2025-03-24' },
      { url: 'https://www.instagram.com/p/DHiKSn-xuZi/?img_index=1', publishedAt: '2025-03-23' },
      { url: 'https://www.instagram.com/p/DHIt8-ozBSi/?img_index=1', publishedAt: '2025-03-13' },
      { url: 'https://www.instagram.com/p/DHGcNyEzYhh/', publishedAt: '2025-03-12' },
      { url: 'https://www.instagram.com/p/DG49ggpxPtr/', publishedAt: '2025-03-07' },
      { url: 'https://www.instagram.com/p/DGQF5Rkvzzo/', publishedAt: '2025-02-19' },
      { url: 'https://www.instagram.com/p/DGDLNoQP8hx/', publishedAt: '2025-02-14' },
      { url: 'https://www.instagram.com/p/DGC9K1VvLzX/', publishedAt: '2025-02-14' },
      { url: 'https://www.instagram.com/p/DGA-oESvyjM/', publishedAt: '2025-02-13' },
      { url: 'https://www.instagram.com/p/DGATzbsPkiL/', publishedAt: '2025-02-13' },
      { url: 'https://www.instagram.com/p/DGAG3qqv37s/?img_index=1', publishedAt: '2025-02-13' },
      { url: 'https://www.instagram.com/p/DFc2Dt8TOfr/?img_index=1', publishedAt: '2025-01-30' },
      { url: 'https://www.instagram.com/p/DEHspX5PRg9/', ratio: '1:1', publishedAt: '2024-12-28' },
      { url: 'https://www.instagram.com/p/DD311OMvGjI/', ratio: '1:1', publishedAt: '2024-12-22' },
      { url: 'https://www.instagram.com/p/DDbmj5iza6C/?img_index=1', ratio: '1:1', publishedAt: '2024-12-11' },
      { url: 'https://www.instagram.com/p/DDZGpySvOXJ/?img_index=1', ratio: '1:1', publishedAt: '2024-12-10' },
      { url: 'https://www.instagram.com/p/DDRUGTjPdrV/', publishedAt: '2024-12-07' },
      { url: 'https://www.instagram.com/p/DDMm921Pr_0/', ratio: '1:1', publishedAt: '2024-12-05' },
      { url: 'https://www.instagram.com/p/DCluJhbvXuX/?img_index=1', ratio: '1:1', publishedAt: '2024-11-20' },
      { url: 'https://www.instagram.com/p/DCi10cdyDeY/?img_index=1', ratio: '1:1', publishedAt: '2024-11-19' },
      { url: 'https://www.instagram.com/p/DCgerRnP589/?img_index=1', ratio: '1:1', publishedAt: '2024-11-18' },
      { url: 'https://www.instagram.com/p/DCZBi5qz1ih/?img_index=1', ratio: '1:1', publishedAt: '2024-11-15' },
      { url: 'https://www.instagram.com/p/DBinXBKPkzZ/?img_index=1', ratio: '16:9', publishedAt: '2024-10-25' },
      { url: 'https://www.instagram.com/p/DBYaEKnPSuX/?img_index=1', ratio: '1:1', publishedAt: '2024-10-21' },
      { url: 'https://www.instagram.com/p/DBdIaO6PVlr/?img_index=1', ratio: '7:5', publishedAt: '2024-10-23' },
      { url: 'https://www.instagram.com/p/DBYKiJsPY80/', ratio: '1:1', publishedAt: '2024-10-21' },
      { url: 'https://www.instagram.com/p/DBRANi-P_fp/', ratio: '1:1', publishedAt: '2024-10-18' },
      { url: 'https://www.instagram.com/p/DAitA7STJ0a/?img_index=1', ratio: '1:1', publishedAt: '2024-09-30' },
      { url: 'https://www.instagram.com/p/DAQFVnJTw-R/?img_index=1', ratio: '1:1', publishedAt: '2024-09-23' },
      { url: 'https://www.instagram.com/p/DAN1RTBTRfz/?img_index=1', ratio: '1:1', publishedAt: '2024-09-22' },
      { url: 'https://www.instagram.com/p/DANpSjjzLA-/?img_index=1', ratio: '1:1', publishedAt: '2024-09-22' },
      { url: 'https://www.instagram.com/p/DANeI03zE_G/?img_index=1', ratio: '1:1', publishedAt: '2024-09-22' },
      { url: 'https://www.instagram.com/p/C_19nX5zdrr/', ratio: '1:1', publishedAt: '2024-09-13' },
      { url: 'https://www.instagram.com/p/C_1zLxmT-_C/?img_index=1', ratio: '1:1', publishedAt: '2024-09-13' },
      { url: 'https://www.instagram.com/p/C_w97ryTkOO/', ratio: '1:1', publishedAt: '2024-09-11' },
      { url: 'https://www.instagram.com/p/C_wzbpSziQ9/?img_index=1', ratio: '1:1', publishedAt: '2024-09-11' },
      { url: 'https://www.instagram.com/p/C_ukkcTTpVd/', ratio: '1:1', publishedAt: '2024-09-10' },
      { url: 'https://www.instagram.com/p/C-KUu7GTPtP/', ratio: '1:1', publishedAt: '2024-08-02' },
      { url: 'https://www.instagram.com/p/C92C9mdTW9s/', ratio: '1:1', publishedAt: '2024-07-25' },
      { url: 'https://www.instagram.com/p/C9rO3X9Tqx5/', ratio: '1:1', publishedAt: '2024-07-21' },
      { url: 'https://www.instagram.com/p/C9mxx6TyV9y/', ratio: '1:1', publishedAt: '2024-07-19' },
      { url: 'https://www.instagram.com/p/C9j8R6HSOhY/', publishedAt: '2024-07-18' },
    ],
    videography: [
      // Paste Videography URLs below
      { url: 'https://www.instagram.com/p/DdL62WMAt9y/', publishedAt: '2026-09-12' },
      { url: 'https://www.instagram.com/p/Dc8fxFeAs_H/', publishedAt: '2026-09-06' },
      { url: 'https://www.instagram.com/p/DUiV3bEEwdQ/', publishedAt: '2026-02-09' },
      { url: 'https://www.instagram.com/p/DT-Y1WeE5Jb/', publishedAt: '2026-01-26' },
      { url: 'https://www.instagram.com/p/DQ6oNA5E--g/', publishedAt: '2025-11-11' },
      { url: 'https://www.instagram.com/p/DPoLuPWk92L/', publishedAt: '2025-10-10' },
      { url: 'https://www.instagram.com/p/DPEHHfckzjX/', publishedAt: '2025-09-26' },
      { url: 'https://www.instagram.com/p/DN7-csLkzju/', publishedAt: '2025-08-29' },
      { url: 'https://www.instagram.com/p/DNdDioBzNSP/', publishedAt: '2025-08-17' },
      { url: 'https://www.instagram.com/p/DK4ScV9Tcfg/', publishedAt: '2025-06-14' },
      { url: 'https://www.instagram.com/p/DKjqO3IzWPr/', publishedAt: '2025-06-06' },
      { url: 'https://www.instagram.com/p/DKHAWqIzrb7/', publishedAt: '2025-05-26' },
      { url: 'https://www.instagram.com/p/DJbdjpLTiwc/', publishedAt: '2025-05-09' },
      { url: 'https://www.instagram.com/p/DEjeQfzzd9y/', publishedAt: '2025-01-08' },
      { url: 'https://www.instagram.com/p/DD82d5Pyqu7/', publishedAt: '2024-12-24' },
      { url: 'https://www.instagram.com/p/DD4LYsOvvXt/', publishedAt: '2024-12-22' },
      { url: 'https://www.instagram.com/p/DDbzmGxvM76/', publishedAt: '2024-12-11' },
      { url: 'https://www.instagram.com/p/C9rkiEzgjgT/', publishedAt: '2024-07-21' },
      { url: 'https://www.instagram.com/p/C7EHGLKrsA-/', publishedAt: '2024-05-17' },
    ],
  },
  {
    id: 'haroy', name: 'HAROY',
    instagramProfileUrl: 'https://www.instagram.com/haroy.bkk/',
    color: '#FBC33A', textColor: '#ffffff',
    logo: { file: 'Haroy.svg', maxWidth: 300, maxHeight: 90, mobileMaxWidth: 230, mobileMaxHeight: 56 },
    photography: [
      // Paste Photography URLs below
      { url: 'https://www.instagram.com/p/DY8yufhmdAZ/?img_index=1', publishedAt: '2026-05-30' },
      { url: 'https://www.instagram.com/p/DdJcb_3maZr/?img_index=1', publishedAt: '2026-09-11' },
      { url: 'https://www.instagram.com/p/DaVTTJdmQIQ/?img_index=1', publishedAt: '2026-07-03' },
      { url: 'https://www.instagram.com/p/DZbrMG9meC1/?img_index=1', publishedAt: '2026-06-11' },
      { url: 'https://www.instagram.com/p/DZC2H_oGbww/?img_index=1', publishedAt: '2026-06-01' },
      { url: 'https://www.instagram.com/p/DRer9ZyCa4v/?img_index=1', publishedAt: '2025-11-25' },
      { url: 'https://www.instagram.com/p/DQb3qiOkvqh/?img_index=1', ratio: '3:4', publishedAt: '2025-10-30' },
      { url: 'https://www.instagram.com/p/DMfdxpXJJh7/?img_index=1', publishedAt: '2025-07-24' },
      { url: 'https://www.instagram.com/p/DKt7oUgJrlb/?img_index=1', publishedAt: '2025-06-10' },
      { url: 'https://www.instagram.com/p/DKW442fpEo0/', publishedAt: '2025-06-01' },
      { url: 'https://www.instagram.com/p/DMITHAHJ3zS/?img_index=1', ratio: '1:1', publishedAt: '2025-07-15' },
      { url: 'https://www.instagram.com/p/DL2FqexpX3t/?img_index=1', ratio: '1:1', publishedAt: '2025-07-08' },
      { url: 'https://www.instagram.com/p/DLkDaKcJ8Wr/?img_index=1', ratio: '1:1', publishedAt: '2025-07-01' },
    ],
    videography: [
      // Paste Videography URLs below
      { url: 'https://www.instagram.com/p/DI6MTc5zsKE/', publishedAt: '2025-04-26' },
      { url: 'https://www.instagram.com/p/DIbSdudpy9t/', publishedAt: '2025-04-14' },
      { url: 'https://www.instagram.com/p/DZH5fBGS12u/', publishedAt: '2026-06-03' },
      { url: 'https://www.instagram.com/p/DUkvlA5gbRV/', publishedAt: '2026-02-10' },
      { url: 'https://www.instagram.com/p/DUSthUNCcN6/', publishedAt: '2026-02-03' },
      { url: 'https://www.instagram.com/p/DUF5L9Fieju/', publishedAt: '2026-01-29' },
      { url: 'https://www.instagram.com/p/DNsm6fkUiCk/', publishedAt: '2025-08-23' },
      { url: 'https://www.instagram.com/p/DNVUp59JUhV/', publishedAt: '2025-08-14' },
      { url: 'https://www.instagram.com/p/DNAv0hFvkX6/', publishedAt: '2025-08-06' },
      { url: 'https://www.instagram.com/p/DL7XD_Ap55q/', publishedAt: '2025-07-10' },
      { url: 'https://www.instagram.com/p/DLwzrPHpZ5o/', publishedAt: '2025-07-06' },
      { url: 'https://www.instagram.com/p/DIEU7B-zUBX/', publishedAt: '2025-04-05' },
    ],
  },
  {
    id: 'yogurbara', name: 'YogurBara',
    instagramProfileUrl: 'https://www.instagram.com/yogurbara.thailand/',
    color: '#4C99FA', textColor: '#ffffff',
    logo: { file: 'YogurBara.svg', maxWidth: 320, maxHeight: 95, mobileMaxWidth: 240, mobileMaxHeight: 58 },
    photography: [
      // Paste Photography URLs below
      { url: 'https://www.instagram.com/p/DdVuQgIEZU9/?img_index=1', publishedAt: '2026-09-16' },
      { url: 'https://www.instagram.com/p/DdRJdMzgY0E/?img_index=1', publishedAt: '2026-09-14' },
      { url: 'https://www.instagram.com/p/DY1v-iJERgc/?img_index=1', ratio: '3:2', publishedAt: '2026-05-27' },
      { url: 'https://www.instagram.com/p/DYPZFt9kVgv/?img_index=1', publishedAt: '2026-05-12' },
      { url: 'https://www.instagram.com/p/DV0xRJeEX6r/', ratio: '3:4', publishedAt: '2026-03-13' },
      { url: 'https://www.instagram.com/p/DWGgkKSkUK5/', ratio: '3:4', publishedAt: '2026-03-20' },
      { url: 'https://www.instagram.com/p/DVaZN7REYdk/?img_index=1', publishedAt: '2026-03-03' },
      { url: 'https://www.instagram.com/p/DSH4Ahpkph3/', publishedAt: '2025-12-11' },
      { url: 'https://www.instagram.com/p/DQeTR_pklL2/?img_index=3', ratio: '3:4', publishedAt: '2025-10-31' },
      { url: 'https://www.instagram.com/p/DPnmd8wEbRt/', ratio: '3:4', publishedAt: '2025-10-10' },
      { url: 'https://www.instagram.com/p/DPi7WX0kcQO/?img_index=1', ratio: '3:4', publishedAt: '2025-10-08' },
      { url: 'https://www.instagram.com/p/DOp1tHgEaQS/?img_index=1', ratio: '16:9', publishedAt: '2025-09-16' },
      { url: 'https://www.instagram.com/p/DNPFilOTvs5/', publishedAt: '2025-08-12' },
      { url: 'https://www.instagram.com/p/DMzQk0TxHfK/', publishedAt: '2025-08-01' },
      { url: 'https://www.instagram.com/p/DLtlKALxyoj/', publishedAt: '2025-07-05' },
      { url: 'https://www.instagram.com/p/DKdqrJ9Ralt/', publishedAt: '2025-06-04' },
      { url: 'https://www.instagram.com/p/DKZMSF3xTDz/', publishedAt: '2025-06-02' },
    ],
    videography: [
      // Paste Videography URLs below
      { url: 'https://www.instagram.com/p/DSUCXIeEe20/', publishedAt: '2025-12-16' },
      { url: 'https://www.instagram.com/p/DSM69nNEXLQ/', publishedAt: '2025-12-13' },
      { url: 'https://www.instagram.com/p/DSJp17ekaBJ/', publishedAt: '2025-12-12' },
      { url: 'https://www.instagram.com/p/DSHckI5kYbC/', publishedAt: '2025-12-11' },
      { url: 'https://www.instagram.com/p/DPkw-h2kXqk/', publishedAt: '2025-10-09' },
      { url: 'https://www.instagram.com/p/DM7Ie7mRs1a/', publishedAt: '2025-08-04' },
      { url: 'https://www.instagram.com/p/DMzOOgEROYu/', publishedAt: '2025-08-01' },
      { url: 'https://www.instagram.com/p/DMxdvmYBQKA/', publishedAt: '2025-07-31' },
      { url: 'https://www.instagram.com/p/DMwvU3gxcyt/', publishedAt: '2025-07-31' },
      { url: 'https://www.instagram.com/p/DMuoncJRhea/', publishedAt: '2025-07-30' },
      { url: 'https://www.instagram.com/p/DLtiXiUxGVN/', publishedAt: '2025-07-05' },
      { url: 'https://www.instagram.com/p/DKWFhiPxxho/', publishedAt: '2025-06-01' },
    ],
  },
  {
    id: 'sushi-pop', name: 'SUSHI POP',
    instagramProfileUrl: 'https://www.instagram.com/sushipop.bkk/',
    color: '#FD5502', textColor: '#ffffff',
    logo: { file: 'Sushipop.svg', maxWidth: 300, maxHeight: 90, mobileMaxWidth: 230, mobileMaxHeight: 56 },
    photography: [
      // Paste Photography URLs below
      { url: 'https://www.instagram.com/p/DdOeNvTvFL4/', ratio: '3:4', publishedAt: '2026-09-13' },
      { url: 'https://www.instagram.com/p/DcK1-NumcJs/?img_index=1', ratio: '3:4', publishedAt: '2026-08-18' },
      { url: 'https://www.instagram.com/p/Db5qTZlmfgW/?img_index=1', ratio: '3:4', publishedAt: '2026-08-11' },
      { url: 'https://www.instagram.com/p/Db0ZXK1GYZw/?img_index=1', ratio: '3:4', publishedAt: '2026-08-09' },
      { url: 'https://www.instagram.com/p/Dbx1BOMmaHi/?img_index=1', ratio: '3:4', publishedAt: '2026-08-08' },
      { url: 'https://www.instagram.com/p/Dbvd-TdmQgb/?img_index=1', ratio: '3:4', publishedAt: '2026-08-07' },
      { url: 'https://www.instagram.com/p/Dbnd-EFPTrf/', ratio: '3:4', publishedAt: '2026-08-04' },
    ],
    videography: [
      // Paste Videography URLs below
      { url: 'https://www.instagram.com/p/DVtFjedD8UP/', publishedAt: '2026-03-10' },
      { url: 'https://www.instagram.com/p/DVsP4tMGTv7/?img_index=1', ratio: '3:4', publishedAt: '2026-03-10' },
      { url: 'https://www.instagram.com/p/DVa4zPID_eu/', publishedAt: '2026-03-03' },
    ],
  },
  {
    id: 'hatch', name: 'HATCH by HAAB',
    instagramProfileUrl: 'https://www.instagram.com/hatch_bkk/',
    color: '#3F0C19', textColor: '#FFFFFF',
    logo: { file: 'HATCH.svg', maxWidth: 320, maxHeight: 100, mobileMaxWidth: 240, mobileMaxHeight: 58 },
    photography: [
      // Paste Photography URLs below
      { url: 'https://www.instagram.com/p/DTXNksFk84s/?img_index=1', ratio: '3:4', publishedAt: '2026-01-11' },
      { url: 'https://www.instagram.com/p/DTVNCjmEwWh/?img_index=1', ratio: '3:4', publishedAt: '2026-01-10' },
      { url: 'https://www.instagram.com/p/DS8_sOuk-jk/?img_index=1', ratio: '3:4', publishedAt: '2026-01-01' },
      { url: 'https://www.instagram.com/p/DSpnnVpk9ay/?img_index=1', ratio: '3:4', publishedAt: '2025-12-24' },
      { url: 'https://www.instagram.com/p/DSPUdYjkyNY/', ratio: '3:4', publishedAt: '2025-12-14' },
      { url: 'https://www.instagram.com/p/DSM7auBEwIt/?img_index=1', ratio: '3:4', publishedAt: '2025-12-13' },
      { url: 'https://www.instagram.com/p/DSJfy3LElge/?img_index=1', ratio: '3:4', publishedAt: '2025-12-12' },
      { url: 'https://www.instagram.com/p/DQ8Wz2uk4yH/?img_index=1', ratio: '3:4', publishedAt: '2025-11-12' },
      { url: 'https://www.instagram.com/p/DPS6m6pE1bf/?img_index=1', ratio: '3:4', publishedAt: '2025-10-02' },
      { url: 'https://www.instagram.com/p/DOQc0b0Ez7m/?img_index=1', ratio: '3:4', publishedAt: '2025-09-06' },
    ],
    videography: [
      // Paste Videography URLs below
      { url: 'https://www.instagram.com/p/DShHs-5k7c6/', publishedAt: '2025-12-21' },
      { url: 'https://www.instagram.com/p/DSFQ5vpk9bT/', publishedAt: '2025-12-10' },
      { url: 'https://www.instagram.com/p/DPA1l1Sk53H/', publishedAt: '2025-09-25' },
      { url: 'https://www.instagram.com/p/DOYahcek3t2/', publishedAt: '2025-09-09' },
    ],
  },
];
