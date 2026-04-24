const lights = Array.from({ length: 8 }, (_, index) => index + 1)
const frontLeaves = Array.from({ length: 8 }, (_, index) => index + 1)
const longGroups = Array.from({ length: 8 }, (_, groupIndex) => ({
  id: groupIndex,
  delays: groupIndex === 0 ? ['3s', '2.2s', '3.4s', '3.6s'] : ['3.6s', '3.8s', '4s', '4.2s'],
}))

function FlowerHead({ variant, lineLeaves }) {
  return (
    <div className={`flower flower--${variant}`}>
      <div className={`flower__leafs flower__leafs--${variant}`}>
        <div className="flower__leaf flower__leaf--1" />
        <div className="flower__leaf flower__leaf--2" />
        <div className="flower__leaf flower__leaf--3" />
        <div className="flower__leaf flower__leaf--4" />
        <div className="flower__white-circle" />
        {lights.map((light) => (
          <div key={light} className={`flower__light flower__light--${light}`} />
        ))}
      </div>
      <div className="flower__line">
        {lineLeaves.map((leaf) => (
          <div key={leaf} className={`flower__line__leaf flower__line__leaf--${leaf}`} />
        ))}
      </div>
    </div>
  )
}

function FloatingFlowerDecoration() {
  return (
    <div className="floating-garden" aria-hidden="true">
      <div className="night" />
      <div className="flowers">
        <FlowerHead variant={1} lineLeaves={[1, 2, 3, 4, 5, 6]} />
        <FlowerHead variant={2} lineLeaves={[1, 2, 3, 4]} />
        <FlowerHead variant={3} lineLeaves={[1, 2, 3, 4]} />

        <div className="grow-ans" style={{ '--d': '1.2s' }}>
          <div className="flower__g-long">
            <div className="flower__g-long__top" />
            <div className="flower__g-long__bottom" />
          </div>
        </div>

        {[1, 2].map((grass) => (
          <div className="growing-grass" key={grass}>
            <div className={`flower__grass flower__grass--${grass}`}>
              <div className="flower__grass--top" />
              <div className="flower__grass--bottom" />
              {lights.map((leaf) => (
                <div key={leaf} className={`flower__grass__leaf flower__grass__leaf--${leaf}`} />
              ))}
              <div className="flower__grass__overlay" />
            </div>
          </div>
        ))}

        <div className="grow-ans" style={{ '--d': '2.4s' }}>
          <div className="flower__g-right flower__g-right--1">
            <div className="leaf" />
          </div>
        </div>

        <div className="grow-ans" style={{ '--d': '2.8s' }}>
          <div className="flower__g-right flower__g-right--2">
            <div className="leaf" />
          </div>
        </div>

        <div className="grow-ans" style={{ '--d': '2.8s' }}>
          <div className="flower__g-front">
            {frontLeaves.map((leaf) => (
              <div
                key={leaf}
                className={`flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--${leaf}`}
              >
                <div className="flower__g-front__leaf" />
              </div>
            ))}
            <div className="flower__g-front__line" />
          </div>
        </div>

        <div className="grow-ans" style={{ '--d': '3.2s' }}>
          <div className="flower__g-fr">
            <div className="leaf" />
            {frontLeaves.map((leaf) => (
              <div key={leaf} className={`flower__g-fr__leaf flower__g-fr__leaf--${leaf}`} />
            ))}
          </div>
        </div>

        {longGroups.map((group) => (
          <div className={`long-g long-g--${group.id}`} key={group.id}>
            {group.delays.map((delay, index) => (
              <div key={`${group.id}-${index}`} className="grow-ans" style={{ '--d': delay }}>
                <div className={`leaf leaf--${index}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FloatingFlowerDecoration
