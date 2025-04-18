import { getPool } from '../../utils/database.js';
import logger from '../../utils/logger.js';

/**
 * Get all external links data for a domain
 * @param {number} domainId - The domain ID
 * @returns {Promise<object>} - Complete external links data for the domain
 */
export async function getAllExternalLinksData(domainId) {
  const pool = await getPool();
  
  try {
    // Get summary data from domain_external_links table
    const [summaryData] = await pool.query(
      `SELECT 
        id, domain_id, external_domain, link_count, is_partner, 
        partner_confidence, partner_context, example_url, 
        created_at, updated_at
       FROM domain_external_links 
       WHERE domain_id = ?
       ORDER BY link_count DESC`,
      [domainId]
    );
    
    // Return early if no data exists
    if (summaryData.length === 0) {
      return null;
    }
    
    // Get detail data from domain_external_links_detail table
    const [detailData] = await pool.query(
      `SELECT 
        id, domain_id, external_domain, source_url, target_url, 
        link_text, is_partner, partner_context, img_src, img_alt, 
        page_id, element_html, seen_in_last_crawl, is_active, 
        last_seen_at, created_at
       FROM domain_external_links_detail 
       WHERE domain_id = ?
       ORDER BY last_seen_at DESC`,
      [domainId]
    );
    
    // Calculate statistics
    const totalExternalDomains = summaryData.length;
    const totalExternalLinks = detailData.length;
    const partnerDomains = summaryData.filter(d => d.is_partner === 1);
    const totalPartnerDomains = partnerDomains.length;
    const totalPartnerLinks = detailData.filter(d => d.is_partner === 1).length;
    
    // Group links by domain
    const linksByDomain = {};
    detailData.forEach(link => {
      if (!linksByDomain[link.external_domain]) {
        linksByDomain[link.external_domain] = [];
      }
      linksByDomain[link.external_domain].push(link);
    });
    
    // Get top domains by link count
    const topDomains = [...summaryData]
      .sort((a, b) => b.link_count - a.link_count)
      .slice(0, 10);
    
    // Get top partner domains by confidence
    const topPartnerDomains = partnerDomains
      .sort((a, b) => b.partner_confidence - a.partner_confidence)
      .slice(0, 10);
    
    // Calculate partner confidence distribution
    const confidenceDistribution = {
      "0.9-1.0": 0,
      "0.8-0.9": 0,
      "0.7-0.8": 0,
      "0.6-0.7": 0,
      "0.5-0.6": 0,
      "0.0-0.5": 0
    };
    
    partnerDomains.forEach(domain => {
      const confidence = domain.partner_confidence;
      if (confidence >= 0.9) confidenceDistribution["0.9-1.0"]++;
      else if (confidence >= 0.8) confidenceDistribution["0.8-0.9"]++;
      else if (confidence >= 0.7) confidenceDistribution["0.7-0.8"]++;
      else if (confidence >= 0.6) confidenceDistribution["0.6-0.7"]++;
      else if (confidence >= 0.5) confidenceDistribution["0.5-0.6"]++;
      else confidenceDistribution["0.0-0.5"]++;
    });
    
    // Return complete dataset
    return {
      summary: summaryData,
      details: detailData,
      stats: {
        totalExternalDomains,
        totalExternalLinks,
        totalPartnerDomains,
        totalPartnerLinks,
        partnerPercentage: totalExternalDomains > 0 ? 
          (totalPartnerDomains / totalExternalDomains * 100).toFixed(1) : 0,
        confidenceDistribution
      },
      topDomains,
      topPartnerDomains,
      linksByDomain
    };
  } catch (error) {
    logger.error(`Error retrieving external links data: ${error.message}`);
    throw error;
  }
}

/**
 * Get detail data for a specific external domain
 * @param {number} domainId - The domain ID
 * @param {string} externalDomain - The external domain to get details for
 * @returns {Promise<object>} - Detailed information about links to the external domain
 */
export async function getExternalDomainDetails(domainId, externalDomain) {
  const pool = await getPool();
  
  try {
    // Get summary data for this external domain
    const [summaryData] = await pool.query(
      `SELECT 
        id, domain_id, external_domain, link_count, is_partner, 
        partner_confidence, partner_context, example_url, 
        created_at, updated_at
       FROM domain_external_links 
       WHERE domain_id = ? AND external_domain = ?`,
      [domainId, externalDomain]
    );
    
    if (summaryData.length === 0) {
      return null;
    }
    
    // Get detail data for this external domain
    const [detailData] = await pool.query(
      `SELECT 
        id, domain_id, external_domain, source_url, target_url, 
        link_text, is_partner, partner_context, img_src, img_alt, 
        page_id, element_html, seen_in_last_crawl, is_active, 
        last_seen_at, created_at
       FROM domain_external_links_detail 
       WHERE domain_id = ? AND external_domain = ?
       ORDER BY last_seen_at DESC`,
      [domainId, externalDomain]
    );
    
    // Return data
    return {
      summary: summaryData[0],
      details: detailData
    };
  } catch (error) {
    logger.error(`Error retrieving external domain details: ${error.message}`);
    throw error;
  }
}

/**
 * Search across all external links for a domain
 * @param {number} domainId - The domain ID
 * @param {string} query - The search query
 * @param {boolean} isActive - Filter by active status
 * @returns {Promise<Array>} - Matching links
 */
export async function searchExternalLinks(domainId, query, isActive = true) {
  const pool = await getPool();
  
  try {
    // Search across link text, target URL, and element HTML
    const [results] = await pool.query(
      `SELECT 
        id, domain_id, external_domain, source_url, target_url, 
        link_text, is_partner, partner_context, img_src, img_alt, 
        page_id, element_html, seen_in_last_crawl, is_active, 
        last_seen_at, created_at
       FROM domain_external_links_detail 
       WHERE domain_id = ? 
       AND is_active = ?
       AND (
         link_text LIKE ? OR
         target_url LIKE ? OR
         element_html LIKE ?
       )
       ORDER BY last_seen_at DESC
       LIMIT 100`,
      [domainId, isActive ? 1 : 0, `%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    return results;
  } catch (error) {
    logger.error(`Error searching external links: ${error.message}`);
    throw error;
  }
} 