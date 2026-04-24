import CircleFeed from '../components/CircleFeed'
import MapView from '../components/MapView'
import SearchFilters from '../components/SearchFilters'

function ExplorePage({
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
    <div className="py-4 py-lg-5">
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
      {viewMode === 'map' ? (
        <MapView circles={filteredCircles} content={content} />
      ) : (
        <CircleFeed circles={filteredCircles} content={content} />
      )}
    </div>
  )
}

export default ExplorePage
