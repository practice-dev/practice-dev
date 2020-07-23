import { TestConfiguration } from '@pvd/tester';
import { S } from '@pvd/schema';

interface Point {
  lat: number;
  lng: number;
}

export default {
  handler({ tester, url }) {
    tester.setBaseApiUrl(url);

    const addPolygons = async (coordinates: Point[][]) => {
      for (const coords of coordinates) {
        const [, res] = await tester.makeRequest({
          method: 'POST',
          path: '/zone',
          body: { coordinates: coords },
        });

        await tester.expectStatus(res, 200);
      }
    };

    const checkPoints = async (points: Point[], isIntersecting: boolean) => {
      for (const point of points) {
        const [body, res] = await tester.makeRequest({
          method: 'POST',
          path: '/check',
          body: point,
        });

        await tester.expectStatus(res, 200);
        const data = await tester.expectSchema(
          body,
          S.object().keys({
            isIntersecting: S.boolean(),
          }),
          'body',
          'IntersectionResult'
        );
        await tester.expectEqual(
          data.isIntersecting,
          isIntersecting,
          'body.isIntersecting'
        );
      }
    };

    tester.test('add 3 polygons', async () => {
      await addPolygons([
        [
          { lat: -33.90771247288984, lng: 151.08187442986141 },
          { lat: -33.942182794564694, lng: 151.11311680046688 },
          { lat: -33.917114852981896, lng: 151.16083866325985 },
          { lat: -33.93933453643492, lng: 151.21577030388485 },
          { lat: -33.884629506312415, lng: 151.23018985954891 },
          { lat: -33.86496131100499, lng: 151.16701847283016 },
          { lat: -33.88947459758581, lng: 151.15465885368954 },
          { lat: -33.879784139866196, lng: 151.10419040886532 },
        ],
        [
          { lat: -33.93933453643492, lng: 151.1409259435333 },
          { lat: -33.93078919032315, lng: 151.11277347771298 },
          { lat: -33.93933453643492, lng: 151.0753512975372 },
          { lat: -33.978062680978816, lng: 151.1028171178497 },
        ],
        [
          { lat: -33.993150492052386, lng: 151.09663730827938 },
          { lat: -33.999412570320516, lng: 151.2023807164825 },
          { lat: -34.05375939107975, lng: 151.07466465202938 },
        ],
      ]);
    });

    tester.test('check 3 outside points', async () => {
      await checkPoints(
        [
          { lat: -33.93078919032315, lng: 151.15877872673641 },
          { lat: -33.9270859406997, lng: 151.08290439812313 },
          { lat: -33.98005556425609, lng: 151.12925296990048 },
        ],
        false
      );
    });

    tester.test('check 2 inside points', async () => {
      await checkPoints(
        [
          { lat: -33.91341100889659, lng: 151.11483341423641 },
          { lat: -33.935346814967495, lng: 151.1141467687286 },
        ],
        true
      );
    });

    tester.test('add 1 polygon', async () => {
      await addPolygons([
        [
          { lat: -33.98574925904196, lng: 151.11655002800595 },
          { lat: -33.967243356619825, lng: 151.12341648308407 },
          { lat: -33.96952122351632, lng: 151.14538913933407 },
          { lat: -33.98290245932325, lng: 151.1416125890411 },
        ],
      ]);
    });

    tester.test('check 1 inside point', async () => {
      await checkPoints(
        [{ lat: -33.98005556425609, lng: 151.12925296990048 }],
        true
      );
    });

    tester.test('add 1 polygon', async () => {
      await addPolygons([
        [
          { lat: -33.91113164021434, lng: 150.94626194206845 },
          { lat: -33.91597522579429, lng: 150.97819095818173 },
          { lat: -33.87750387221085, lng: 150.95621830193173 },
          { lat: -33.895744307198825, lng: 151.03003269402157 },
          { lat: -33.91569031661592, lng: 150.99432712761532 },
          { lat: -33.94275243475554, lng: 151.03621250359188 },
          { lat: -33.92993460854761, lng: 150.9874606725372 },
          { lat: -33.965534916409865, lng: 150.99707370964657 },
          { lat: -33.94673980936026, lng: 150.95347171990048 },
          { lat: -33.93221347422673, lng: 150.97407108513485 },
          { lat: -33.926231321766906, lng: 150.92428928581845 },
          { lat: -33.88975959438504, lng: 150.91845279900204 },
        ],
      ]);
    });

    tester.test('check 1 inside point', async () => {
      await checkPoints(
        [{ lat: -33.917468691696214, lng: 150.97929585994112 }],
        true
      );
    });

    tester.test('check 2 outside points', async () => {
      await checkPoints(
        [
          { lat: -33.9091371426103, lng: 150.9658313390411 },
          { lat: -33.91303493362209, lng: 150.97345910325586 },
        ],
        false
      );
    });
  },
} as TestConfiguration;
