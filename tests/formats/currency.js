
// Node
if (typeof module !== 'undefined' && module.exports) {
    var numeral = require('../../numeral');
    var locales = require('../../locales');
    var expect = require('chai').expect;
}

describe('Currency', function() {
    after(function() {
        numeral.reset();
    });

    it('should format to currency', function() {
        var tests = [
                [0,'$0.00','$0.00'],
                [null,'$0.00','$0.00'],
                [0.99,'$0,0.00','$0.99'],
                [1000.234,'$0,0.00','$1,000.23'],
                [1001,'$ 0,0.[00]','$ 1,001'],
                [1000.234,'0,0.00 $','1,000.23 $'],
                [-1000.234,'0,0.00 $','-1,000.23 $'],
                [-1000.234,'($0,0)','($1,000)'],
                [-1000.234,'(0,0$)','(1,000$)'],
                [-1000.234,'(0,0 $)','(1,000 $)'],
                [-1000.234,'$0.00','-$1000.23'],
                [-1000.234,'$ 0.00','-$ 1000.23'],
                [1230974,'($0.00 a)','$1.23 m'],
                [-1000.234,'$ (0,0)','$ (1,000)'],
                [-1000.234,'$(0,0)','$(1,000)'],
                [-1000.234,'$ (0,0.00)','$ (1,000.23)'],
                [-1000.234,'$(0,0.00)','$(1,000.23)'],
                [-1000.238,'$(0,0.00)','$(1,000.24)'],
                [-1000.234,'$-0,0','$-1,000'],
                [-1000.234,'$ -0,0','$ -1,000'],
                [1000.234,'$ (0,0)','$ 1,000'],
                [1000.234,'$(0,0)','$1,000'],
                [1000.234,'$ (0,0.00)','$ 1,000.23'],
                [1000.234,'$(0,0.00)','$1,000.23'],
                [1000.238,'$(0,0.00)','$1,000.24'],
                [1000.234,'$-0,0','$1,000'],
                [1000.234,'$ -0,0','$ 1,000']
            ],
            i;

        for (i = 0; i < tests.length; i++) {
            expect(numeral(tests[i][0]).format(tests[i][1])).to.equal(tests[i][2]);
        }
    });

    it('should place currency around negative values rounded to zero', function() {
        var tests = [
                ['$0,0.00', '$0.00'],
                ['$ 0,0.00', '$ 0.00'],
                ['0,0.00$', '0.00$'],
                ['0,0.00 $', '0.00 $'],
                ['($0,0.00)', '$0.00'],
                ['($ 0,0.00)', '$ 0.00'],
                ['$(0,0.00)', '$0.00'],
                ['$ (0,0.00)', '$ 0.00'],
                ['(0,0.00$)', '0.00$'],
                ['(0,0.00 $)', '0.00 $'],
                ['(0,0.00)$', '0.00$'],
                ['(0,0.00) $', '0.00 $'],
                ['$0', '$0'],
                ['($0)', '$0'],
                ['$0.0[0]', '$0.0'],
                ['$0.[00]', '$0'],
                ['$0[.]00', '$0'],
                ['$0000,0.00', '$0,000.00'],
                ['($.00)', '$.00'],
                ['($0.00 ak)', '$0.00 k']
            ],
            i;

        for (i = 0; i < tests.length; i++) {
            expect(numeral(-0.001).format(tests[i][0])).to.equal(tests[i][1]);
            expect(numeral(0).format(tests[i][0])).to.equal(tests[i][1]);
            expect(numeral(0.001).format(tests[i][0])).to.equal(tests[i][1]);
        }
    });

    it('should preserve the numeric formatter sign and its currency position', function() {
        var tests = [
                [-0.001, '+$0.00', '+$0.00'],
                [-0.001, '$+0.00', '$+0.00'],
                [-0.001, '$ +0.00', '$ +0.00'],
                [-0.001, '0.00+$', '0.00+$'],
                [-0.001, '0.00$+', '0.00$+'],
                [-0.001, '0.00 $+', '0.00 $+'],
                [-0.001, '-$0.00', '+$0.00'],
                [-0.001, '$-0.00', '$+0.00'],
                [-0.001, '0.00-$', '0.00+$'],
                [-0.001, '0.00$-', '0.00$+'],
                [-0.001, '$0.00+', '$0.00+'],
                [-0.001, '$0.00-', '$0.00+'],
                [-0.006, '+$0.00', '-$0.01'],
                [-0.006, '$+0.00', '$-0.01'],
                [-0.006, '$ +0.00', '$ -0.01'],
                [-0.006, '0.00$+', '0.01$-'],
                [-0.006, '-$0.00', '-$0.01'],
                [-0.006, '$-0.00', '$-0.01'],
                [-0.006, '0.00$-', '0.01$-'],
                [-0.006, '$0.00+', '$0.01-'],
                [-0.006, '$0.00-', '$0.01-'],
                [0, '+$0.00', '+$0.00'],
                [0, '$+0.00', '$+0.00'],
                [0, '-$0.00', '$0.00'],
                [0, '0.00$-', '0.00$'],
                [0.006, '$+0.00', '$+0.01']
            ],
            i;

        for (i = 0; i < tests.length; i++) {
            expect(numeral(tests[i][0]).format(tests[i][1])).to.equal(tests[i][2]);
        }
    });

    it('should use the supplied rounding function for currency placement', function() {
        var tests = [
                [-0.001, '$0.00', Math.floor, '-$0.01'],
                [-0.001, '$0.00', Math.ceil, '$0.00'],
                [-0.006, '($0.00)', Math.round, '($0.01)'],
                [-0.006, '($0.00)', Math.ceil, '$0.00'],
                [-0.001, '(0.00 $)', Math.floor, '(0.01 $)'],
                [-0.001, '(0.00 $)', Math.ceil, '0.00 $'],
                [-0.001, '$0.[00]', Math.floor, '-$0.01'],
                [-0.001, '$0.[00]', Math.ceil, '$0'],
                [-0.5, '$0', Math.round, '$0'],
                [-0.5, '$0', Math.floor, '-$1']
            ],
            i;

        for (i = 0; i < tests.length; i++) {
            expect(numeral(tests[i][0]).format(tests[i][1], tests[i][2])).to.equal(tests[i][3]);
        }
    });

    it('should round currency only once', function() {
        var calls = 0,
            output = numeral(-0.001).format('($0.00)', function(value) {
                calls++;
                return Math.ceil(value);
            });

        expect(output).to.equal('$0.00');
        expect(calls).to.equal(1);
    });

    it('should not mistake a localized abbreviation for a trailing sign', function() {
        var abbreviations = numeral.localeData().abbreviations,
            thousand = abbreviations.thousand,
            suffixes = ['k-', 'k+'],
            i;

        try {
            for (i = 0; i < suffixes.length; i++) {
                abbreviations.thousand = suffixes[i];
                expect(numeral(-0.001).format('($0.00 ak)')).to.equal('$0.00 ' + suffixes[i]);
                expect(numeral(0).format('($0.00 ak)')).to.equal('$0.00 ' + suffixes[i]);
                expect(numeral(-1000).format('($0.00 ak)')).to.equal('($1.00 ' + suffixes[i] + ')');
                expect(numeral(0).format('0.00 ak$-')).to.equal('0.00 ' + suffixes[i] + '$');
                expect(numeral(0.001).format('0.00 ak$-')).to.equal('0.00 ' + suffixes[i] + '$');
                expect(numeral(-0.001).format('0.00 ak$-')).to.equal('0.00 ' + suffixes[i] + '$+');
                expect(numeral(-1000).format('0.00 ak$-')).to.equal('1.00 ' + suffixes[i] + '$-');
            }
        } finally {
            abbreviations.thousand = thousand;
        }
    });

    describe('Localized rounded zero', function() {
        before(function() {
            numeral.locale('de-ch');
        });

        after(function() {
            numeral.reset();
        });

        it('should preserve decimal delimiters, grouping and multi-character symbols', function() {
            var tests = [
                    [-0.001, '$0,0.00', 'CHF0,00'],
                    [-0.001, '$ 0,0.00', 'CHF 0,00'],
                    [-0.001, '($0,0.00)', 'CHF0,00'],
                    [-0.001, '($ 0,0.00)', 'CHF 0,00'],
                    [-0.001, '0,0.00 $', '0,00 CHF'],
                    [-0.001, '(0,0.00$)', '0,00CHF'],
                    [-0.001, '(0,0.00 $)', '0,00 CHF'],
                    [-0.001, '(0,0.00) $', '0,00 CHF'],
                    [-0.001, '+$0.00', '+CHF0,00'],
                    [-0.001, '$+0.00', 'CHF+0,00'],
                    [-0.001, '0.00 $+', '0,00 CHF+'],
                    [-0.001, '$0000,0.00', 'CHF0 000,00'],
                    [-0.001, '($0.[00])', 'CHF0'],
                    [-0.001, '($0.00 ak)', 'CHF0,00 k'],
                    [-0.006, '($ 0,0.00)', '(CHF 0,01)'],
                    [-1234.56, '(0,0.00 $)', '(1 234,56 CHF)'],
                    [0, '$0,0.00', 'CHF0,00'],
                    [0.001, '$0,0.00', 'CHF0,00']
                ],
                i;

            for (i = 0; i < tests.length; i++) {
                expect(numeral(tests[i][0]).format(tests[i][1])).to.equal(tests[i][2]);
            }
        });
    });

    it('should unformat to currency', function() {
        var tests = [
                ['$0.00', 0],
                ['$0.99', 0.99],
                ['$1,000.23', 1000.23],
                ['1,000.23 $', 1000.23],
                ['($1,000)', -1000],
                ['-1,000$', -1000],
                ['$1.23 m', 1230000],
            ],
            i;

        for (i = 0; i < tests.length; i++) {
            expect(numeral(tests[i][0]).value()).to.equal(tests[i][1]);
        }
    });
});
