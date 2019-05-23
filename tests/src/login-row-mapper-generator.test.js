// Local modules
const loginRowMapperGenerator = require('../../src/login-row-mapper-generator')

const sampleRows = [
  '',
  '',
  'ArtemisF',
  'boreas',
  'Comms',
  'cronos',
  'DIONYSUS',
  'eros',
  'FURIES',
  'Gaia (APAC)',
  'Hades (EMEA)',
  'Iris',
  'TO BE HIRED',
  'JamesMGreene',
  'Kratos',
  'Leto',
  'MEDUSA (EMEA)',
  'Nike - Swoosh',
  'Ouranos',
  'Persephone (EMEA)',
  'TO BE HIRED',
  'TO BE HIRED',
  'Queen of Stuff',
  'Rhea',
  'styx',
  'Triton',
  'Urania (EMEA)',
  'Volvo is not Greek',
  'WonderWoman is not Greek',
  'Xanadu is not Greek',
  'You may or may not be Greek? (EMEA)',
  'Zeus',
  //  etc...
  '',
  'Legend',
  'Available',
  'Available for remote engagements',
  'Not available for engagements\n(OOO, Internal, Conference, etc.)',
  '[O] Onsite, Confirmed',
  '[R] Remote, Confirmed',
  '[HO] Onsite, Hold',
  '[HR] Remote, Hold',
  'SAE Slot'
]

const expectedOutput = [
  { row: '1', value: null },
  { row: '2', value: null },
  { row: '3', value: 'artemisf' },
  { row: '4', value: 'boreas' },
  { row: '5', value: null },
  { row: '6', value: 'cronos' },
  { row: '7', value: 'dionysus' },
  { row: '8', value: 'eros' },
  { row: '9', value: 'furies' },
  { row: '10', value: 'gaia' },
  { row: '11', value: 'hades' },
  { row: '12', value: 'iris' },
  { row: '13', value: null },
  { row: '14', value: 'jamesmgreene' },
  { row: '15', value: 'kratos' },
  { row: '16', value: 'leto' },
  { row: '17', value: 'medusa' },
  { row: '18', value: 'nike' },
  { row: '19', value: 'ouranos' },
  { row: '20', value: 'persephone' },
  { row: '21', value: null },
  { row: '22', value: null },
  { row: '23', value: 'queen' },
  { row: '24', value: 'rhea' },
  { row: '25', value: 'styx' },
  { row: '26', value: 'triton' },
  { row: '27', value: 'urania' },
  { row: '28', value: 'volvo' },
  { row: '29', value: 'wonderwoman' },
  { row: '30', value: 'xanadu' },
  { row: '31', value: 'you' },
  { row: '32', value: 'zeus' },
  //  etc...
  { row: '33', value: null },
  { row: '34', value: null },
  { row: '35', value: null },
  { row: '36', value: null },
  { row: '37', value: null },
  { row: '38', value: null },
  { row: '39', value: null },
  { row: '40', value: null },
  { row: '41', value: null },
  { row: '42', value: null }
]

describe('login-row-mapper-generator', () => {
  it('returns a function', () => {
    const loginRowMapper = loginRowMapperGenerator()
    expect(typeof loginRowMapper).toBe('function')
    expect(loginRowMapper.length).toBe(2)
  })

  describe('resulting mapper function', () => {
    let loginRowMapper

    beforeEach(() => {
      loginRowMapper = loginRowMapperGenerator()
    })

    it('returns expected values', () => {
      expect(sampleRows.map(loginRowMapper)).toEqual(expectedOutput)
    })

    it('can be serially reused after a "legend" value has been encountered', () => {
      expect(sampleRows.map(loginRowMapper)).toEqual(expectedOutput)
      expect(sampleRows.map(loginRowMapper)).toEqual(expectedOutput)
    })
  })
})
