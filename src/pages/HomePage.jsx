import CircleFeed from '../components/CircleFeed'
import HeroSection from '../components/HeroSection'
import MapView from '../components/MapView'
import SearchFilters from '../components/SearchFilters'

function HomePage({
  content,
  language,
  filters,
  regions,
  comunas,
  onChangeFilter,
  onClearFilters,
  filteredCircles,
  viewMode,
  onViewModeChange,
}) {
  return (
    <>
      <HeroSection content={content} />
      <SearchFilters
        content={content}
        language={language}
        filters={filters}
        regions={regions}
        comunas={comunas}
        onChange={onChangeFilter}
        onClear={onClearFilters}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        resultsCount={filteredCircles.length}
      />
      <section className="container pb-3">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="text-uppercase small fw-semibold circular-eyebrow mb-1">
              {content.circle.upcoming}
            </p>
            <h2 className="fw-semibold circular-heading mb-0">{content.search.title}</h2>
          </div>
        </div>
      </section>
      {viewMode === 'map' ? (
        <MapView circles={filteredCircles} content={content} />
      ) : (
        <CircleFeed circles={filteredCircles.slice(0, 6)} content={content} />
      )}
    </>
  )
}

export default HomePage
