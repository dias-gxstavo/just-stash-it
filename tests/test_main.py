from datetime import datetime, timezone
from http import HTTPStatus

import pytest


@pytest.mark.asyncio
async def test_create_paste_must_return_slug(client):
    resp = client.post(
        '/api/paste',
        json={
            'content_name': 'index.html',
            'content_body': '<h1> Its works! </h1>',
            'created_at': datetime.now(timezone.utc).isoformat(),
            'expires_in': '5m',
        },
    )
    data = resp.json()
    assert type(data) is dict
    assert resp.status_code == HTTPStatus.CREATED


@pytest.mark.asyncio
async def test_get_paste_must_return_slug(client):
    created = client.post(
        '/api/paste',
        json={
            'content_name': 'index.html',
            'content_body': '<h1> Testing /get/ endpoint </h1>',
            'created_at': datetime.now(timezone.utc).isoformat(),
            'expires_in': '5m',
        },
    )

    assert created.status_code == HTTPStatus.CREATED

    created_data = created.json()
    slug = created_data['slug']

    response = client.get(f'/api/{slug}')

    assert response.status_code == HTTPStatus.OK

    data = response.json()

    assert data['content_name'] == 'index.html'
    assert data['content_body'] == '<h1> Testing /get/ endpoint </h1>'
