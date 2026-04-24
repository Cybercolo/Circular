import { circleTypeOptions, priceOptions } from '../services/content'

function SearchFilters({
  content,
  language,
  filters,
  regions,
  comunas,
  onChange,
  onClear,
  viewMode,
  onViewModeChange,
  resultsCount,
}) {
  return (
    <section className="container pb-4">
      <div className="search-panel rounded-5 p-4 p-lg-5">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
          <div>
            <h2 className="fw-semibold circular-heading mb-2">{content.search.title}</h2>
            <p className="mb-0 circular-copy">{content.search.subtitle}</p>
          </div>

          {onViewModeChange && (
            <div className="d-flex gap-2 align-self-start">
              <button
                type="button"
                className={`btn rounded-pill ${viewMode === 'list' ? 'circular-btn-primary' : 'btn-light'}`}
                onClick={() => onViewModeChange('list')}
              >
                {content.search.listView}
              </button>
              <button
                type="button"
                className={`btn rounded-pill ${viewMode === 'map' ? 'circular-btn-primary' : 'btn-light'}`}
                onClick={() => onViewModeChange('map')}
              >
                {content.search.mapView}
              </button>
            </div>
          )}
        </div>

        <div className="row g-3 align-items-end">
          <div className="col-12">
            <label className="form-label fw-semibold">{content.search.searchPlaceholder}</label>
            <input
              type="text"
              className="form-control circular-input"
              value={filters.query}
              onChange={(event) => onChange('query', event.target.value)}
              placeholder={content.search.searchPlaceholder}
            />
          </div>

          <div className="col-sm-6 col-lg-2">
            <label className="form-label">{content.search.region}</label>
            <select
              className="form-select circular-input"
              value={filters.region}
              onChange={(event) => onChange('region', event.target.value)}
            >
              <option value="">{content.search.all}</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6 col-lg-2">
            <label className="form-label">{content.search.comuna}</label>
            <select
              className="form-select circular-input"
              value={filters.comuna}
              onChange={(event) => onChange('comuna', event.target.value)}
            >
              <option value="">{content.search.all}</option>
              {comunas.map((comuna) => (
                <option key={comuna} value={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6 col-lg-2">
            <label className="form-label">{content.search.date}</label>
            <input
              type="date"
              className="form-control circular-input"
              value={filters.date}
              onChange={(event) => onChange('date', event.target.value)}
            />
          </div>

          <div className="col-sm-6 col-lg-2">
            <label className="form-label">{content.search.type}</label>
            <select
              className="form-select circular-input"
              value={filters.type}
              onChange={(event) => onChange('type', event.target.value)}
            >
              {circleTypeOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {language === 'es' ? option.labelEs : option.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6 col-lg-2">
            <label className="form-label">{content.search.price}</label>
            <select
              className="form-select circular-input"
              value={filters.price}
              onChange={(event) => onChange('price', event.target.value)}
            >
              {priceOptions.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {language === 'es' ? option.labelEs : option.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div className="col-sm-6 col-lg-2">
            <button type="button" className="btn btn-light w-100 rounded-pill" onClick={onClear}>
              {content.search.clear}
            </button>
          </div>
        </div>

        <p className="mt-4 mb-0 circular-text-soft">
          <strong>{resultsCount}</strong> {content.search.results}
        </p>
      </div>
    </section>
  )
}

export default SearchFilters
