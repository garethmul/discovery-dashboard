import { getPool } from '../db.js';
import logger from '../../utils/logger.js';

/**
 * Finds all related AI analysis data by domain ID.
 * @param {number} domainId - The domain_info ID.
 * @returns {Promise<object|null>} - An object containing all AI analysis parts, or null if none found.
 */
export const findByDomainId = async (domainId) => {
  const db = await getPool();
  try {
    logger.info(`[AI Analysis] Starting AI data fetch for domain ID ${domainId}`);
    
    // First check if AI data might be in domain_info table as a JSON field
    const [domainInfoRows] = await db.query('SELECT ai_analysis FROM domain_info WHERE id = ?', [domainId]);
    logger.info(`[AI Analysis] domain_info query result:`, JSON.stringify(domainInfoRows, null, 2));
    
    if (domainInfoRows.length > 0 && domainInfoRows[0].ai_analysis) {
      logger.info(`[AI Analysis] Found AI data in domain_info table:`, JSON.stringify(domainInfoRows[0].ai_analysis, null, 2));
      return {
        ai_analysis: domainInfoRows[0].ai_analysis,
        _source: 'domain_info_table'
      };
    }
    
    logger.info(`[AI Analysis] No AI data found in domain_info table, checking specialized tables...`);
    
    // Check for the brandfetch_data table
    try {
      // First get the domain name
      const [domainInfo] = await db.query('SELECT domain FROM domain_info WHERE id = ?', [domainId]);
      const domainName = domainInfo[0]?.domain;
      
      if (domainName) {
        const [brandfetchRows] = await db.query('SELECT * FROM brandfetch_data WHERE domain = ?', [domainName]);
        logger.info(`[AI Analysis] brandfetch_data query result:`, JSON.stringify(brandfetchRows, null, 2));
        
        if (brandfetchRows.length > 0) {
          logger.info(`[AI Analysis] Found brandfetch data`);
          return {
            brandfetch_data: brandfetchRows[0],
            _source: 'brandfetch_data_table'
          };
        }
      } else {
        logger.warn(`[AI Analysis] Could not find domain name for ID: ${domainId}`);
      }
    } catch (err) {
      logger.warn(`[AI Analysis] Error checking brandfetch_data: ${err.message}`);
    }
    
    // Try to fetch from domain_ prefixed tables
    try {
      logger.info(`[AI Analysis] Checking domain_ prefixed tables...`);
      
      // Log the SQL queries being executed
      const brandAnalysisQuery = 'SELECT * FROM domain_brand_analysis WHERE domain_id = ?';
      const appSuggestionsQuery = 'SELECT * FROM domain_app_suggestions WHERE domain_id = ?';
      const featuresQuery = 'SELECT * FROM domain_features WHERE domain_id = ?';
      const colorSchemesQuery = 'SELECT * FROM domain_color_schemes WHERE domain_id = ?';
      const contentCategoriesQuery = 'SELECT * FROM domain_content_categories WHERE domain_id = ?';
      const marketingTipsQuery = 'SELECT * FROM domain_marketing_tips WHERE domain_id = ?';
      const appIdeasQuery = 'SELECT * FROM domain_app_ideas WHERE domain_id = ?';

      logger.info(`[AI Analysis] Executing queries for domain ${domainId}:`, {
        brandAnalysisQuery,
        appSuggestionsQuery,
        featuresQuery,
        colorSchemesQuery,
        contentCategoriesQuery,
        marketingTipsQuery,
        appIdeasQuery
      });
      
      // Fetch from each AI-related table
      const [brandAnalysisRows] = await db.query(brandAnalysisQuery, [domainId]);
      const [appSuggestionsRows] = await db.query(appSuggestionsQuery, [domainId]);
      const [featuresRows] = await db.query(featuresQuery, [domainId]);
      const [colorSchemesRows] = await db.query(colorSchemesQuery, [domainId]);
      const [contentCategoriesRows] = await db.query(contentCategoriesQuery, [domainId]);
      const [marketingTipsRows] = await db.query(marketingTipsQuery, [domainId]);
      const [appIdeasRows] = await db.query(appIdeasQuery, [domainId]);

      // Log results from each table
      logger.info(`[AI Analysis] Table query results for domain ${domainId}:`, {
        brandAnalysis: {
          count: brandAnalysisRows.length,
          data: brandAnalysisRows
        },
        appSuggestions: {
          count: appSuggestionsRows.length,
          data: appSuggestionsRows
        },
        features: {
          count: featuresRows.length,
          data: featuresRows
        },
        colorSchemes: {
          count: colorSchemesRows.length,
          data: colorSchemesRows
        },
        contentCategories: {
          count: contentCategoriesRows.length,
          data: contentCategoriesRows
        },
        marketingTips: {
          count: marketingTipsRows.length,
          data: marketingTipsRows
        },
        appIdeas: {
          count: appIdeasRows.length,
          data: appIdeasRows
        }
      });

      // Check if we found any data at all
      if (!brandAnalysisRows.length && !appSuggestionsRows.length && !featuresRows.length &&
          !colorSchemesRows.length && !contentCategoriesRows.length && !marketingTipsRows.length && 
          !appIdeasRows.length) {
        logger.info(`[AI Analysis] No data found in any specialized tables for domain ${domainId}`);
        return null;
      }

      // Combine results into a single object
      const aiData = {
        brandAnalysis: brandAnalysisRows[0] ? {
          industryCategory: brandAnalysisRows[0].industry_category,
          businessType: brandAnalysisRows[0].business_type,
          targetAudience: brandAnalysisRows[0].target_audience,
          brandVoice: brandAnalysisRows[0].brand_voice,
          brandValues: brandAnalysisRows[0].brand_values,
          marketPosition: brandAnalysisRows[0].market_position,
          competitiveAdvantage: brandAnalysisRows[0].competitive_advantage,
          keyDifferentiators: brandAnalysisRows[0].key_differentiators
        } : null,
        appSuggestions: appSuggestionsRows[0] ? {
          name1: appSuggestionsRows[0].name_option_1,
          name2: appSuggestionsRows[0].name_option_2,
          name3: appSuggestionsRows[0].name_option_3,
          description: appSuggestionsRows[0].description,
          targetAudience: appSuggestionsRows[0].target_audience,
          monetizationStrategy: appSuggestionsRows[0].monetization_strategy,
          developmentTime: appSuggestionsRows[0].development_time
        } : null,
        features: featuresRows.map(row => ({
          name: row.name,
          description: row.description,
          priority: row.priority
        })),
        colorSchemes: colorSchemesRows.map(row => ({
          name: row.name,
          primary: row.primary_color,
          secondary: row.secondary_color,
          accent: row.accent_color
        })),
        contentCategories: contentCategoriesRows.map(row => ({
          name: row.name,
          description: row.description
        })),
        marketingTips: marketingTipsRows.map(row => ({
          text: row.tip_text,
          category: row.category
        })),
        appIdeas: appIdeasRows.map(row => ({
          number: row.idea_number,
          headline: row.headline,
          description: row.description
        })),
        _source: 'domain_prefixed_tables'
      };

      // Log the final combined data
      logger.info(`[AI Analysis] Combined AI data for domain ${domainId}:`, JSON.stringify(aiData, null, 2));

      // Clean up null values
      Object.keys(aiData).forEach(key => {
        if (aiData[key] === null || (Array.isArray(aiData[key]) && aiData[key].length === 0)) {
          delete aiData[key];
        }
      });

      logger.info(`[AI Analysis] Final cleaned AI data for domain ${domainId}:`, JSON.stringify(aiData, null, 2));
      return Object.keys(aiData).length > 1 ? aiData : null; // > 1 because we always have _source
    } catch (error) {
      // If we get table doesn't exist, log it but don't throw
      if (error.code === 'ER_NO_SUCH_TABLE') {
        logger.warn(`[AI Analysis] Some AI Analysis tables missing: ${error.message}`);
        return null;
      }
      throw error; // Rethrow other errors
    }
    
  } catch (error) {
    logger.error(`[AI Analysis] Error fetching AI data for domain ${domainId}: ${error.message}`, error);
    throw error;
  }
};

// Add other necessary functions like create, update etc. if needed elsewhere 